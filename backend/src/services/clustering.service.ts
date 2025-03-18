import { ClusterResult, DeviceMetrics, GeoMetrics, PageTransition, SequenceAnalysis, SequenceTransition, SessionMetrics, TemporalResult, TimeUnit, UserMetrics } from './types/clustering.dto'
import clusteringDal from '../data/clustering.dal';
import clusteringUtility from './utils/clustering.utility'
import * as clustering from 'density-clustering';
import { SequenceEvent } from 'src/data/@types/cluster.dao';

class ClusteringService {
    async getInteractionClusters(webId: number): Promise<ClusterResult> {
        const interactions = await clusteringDal.getInteractions(webId);

        const points = interactions.map(i => ({
            x: i.x,
            y: i.y,
            duration: i.duration
        }));

        const dbscan = new clustering.DBSCAN();
        const neighborhoodRadius = 30;
        const minPointsPerCluster = 5;

        const clusterResults = dbscan.run(
            points.map(p => [p.x, p.y, p.duration]),
            neighborhoodRadius,
            minPointsPerCluster,
            clusteringUtility.calculateDistance
        );

        const metrics = {
            silhouetteScore: clusteringUtility.calculateSilhouetteScore(clusterResults),
            daviesBouldinIndex: clusteringUtility.calculateDaviesBouldinIndex(clusterResults),
            clusterSizes: clusteringUtility.getClusterSizes(clusterResults)
        };

        return {
            clusters: clusteringUtility.formatClusters(clusterResults, points),
            metrics
        };
    }

    async getTemporalAnalysis(webId: number, timeUnit: keyof TimeUnit): Promise<TemporalResult[]> {
        const temporalData = await clusteringDal.getTemporalData(webId, timeUnit);

        return temporalData.map(data => ({
            time_bucket: clusteringUtility.formatTimeBucket(data.time_bucket, timeUnit),
            event_count: data.event_count,
            unique_users: data.unique_users
        }));
    }

    async getAnalysisSummary(webId: number): Promise<any> {
        const [interactionClusters, temporalData] = await Promise.all([
            this.getInteractionClusters(webId),
            this.getTemporalAnalysis(webId, 'day')
        ]);

        const metrics = await clusteringDal.getClusterMetrics(webId);

        return {
            clusters: {
                count: interactionClusters.clusters.length,
                metrics: interactionClusters.metrics,
                distribution: clusteringUtility.calculateClusterDistribution(interactionClusters)
            },
            temporal: {
                peakHours: clusteringUtility.findPeakHours(temporalData),
                activityTrend: clusteringUtility.calculateActivityTrend(temporalData)
            },
            metrics: clusteringUtility.summarizeMetrics(metrics)
        };
    }

    async getUserAnalysis(webId: number): Promise<UserMetrics[]> {
        return await clusteringDal.getUserAnalysis(webId);
    }

    // async getSequenceAnalysis(webId: number): Promise<UserMetrics[]> {
    // return await clusteringDal.getSequenceAnalysis(webId);



    async getSequenceAnalysis(webId: number): Promise<SequenceAnalysis> {
        const sequences = await clusteringDal.getSequenceAnalysis(webId);

        const sessionPaths = sequences.reduce((acc: Record<string, string[]>, event: SequenceEvent) => {
            if (!acc[event.session_id]) {
                acc[event.session_id] = [];
            }
            acc[event.session_id].push(event.page_url);
            return acc;
        }, {});

        const sessionDurations = sequences.reduce((acc: Record<string, number>, event: SequenceEvent) => {
            acc[event.session_id] = event.duration;
            return acc;
        }, {});

        const calculateDTW = (seq1: string[], seq2: string[]): number => {
            const m = seq1.length;
            const n = seq2.length;
            const dtw: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(Infinity));

            dtw[0][0] = 0;

            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    const cost = seq1[i - 1] === seq2[j - 1] ? 0 : 1;
                    dtw[i][j] = cost + Math.min(
                        dtw[i - 1][j],
                        dtw[i][j - 1],
                        dtw[i - 1][j - 1]
                    );
                }
            }

            return dtw[m][n] / Math.max(m, n);
        };

        const similarities: Array<{
            session1: string;
            session2: string;
            similarity: number;
        }> = [];

        const sessions = Object.keys(sessionPaths);
        for (let i = 0; i < sessions.length; i++) {
            for (let j = i + 1; j < sessions.length; j++) {
                const similarity = calculateDTW(
                    sessionPaths[sessions[i]],
                    sessionPaths[sessions[j]]
                );
                similarities.push({
                    session1: sessions[i],
                    session2: sessions[j],
                    similarity
                });
            }
        }

        const SIMILARITY_THRESHOLD = 0.3;
        const clusters = new Map<string, Set<string>>();

        similarities.forEach(({ session1, session2, similarity }) => {
            if (similarity <= SIMILARITY_THRESHOLD) {
                if (!clusters.has(session1)) {
                    clusters.set(session1, new Set([session1]));
                }
                if (!clusters.has(session2)) {
                    clusters.set(session2, new Set([session2]));
                }

                const cluster1 = clusters.get(session1)!;
                const cluster2 = clusters.get(session2)!;
                const mergedCluster = new Set([...cluster1, ...cluster2]);

                for (const session of mergedCluster) {
                    clusters.set(session, mergedCluster);
                }
            }
        });

        const uniqueClusters = new Set(
            Array.from(clusters.values())
                .map(set => JSON.stringify(Array.from(set).sort()))
        );

        const clusterStats = Array.from(uniqueClusters).map(clusterJson => {
            const sessions: string[] = JSON.parse(clusterJson);
            const paths: string[][] = sessions.map(sessionId => sessionPaths[sessionId]);

            const avgPathLength = paths.reduce((sum: number, path: string[]) =>
                sum + path.length, 0) / paths.length;

            const avgDuration = sessions.reduce((sum: number, sessionId: string) =>
                sum + (sessionDurations[sessionId] || 0), 0) / sessions.length;

            const transitions: Record<string, number> = {};
            paths.forEach((path: string[]) => {
                for (let i = 0; i < path.length - 1; i++) {
                    const transition = `${path[i]} -> ${path[i + 1]}`;
                    transitions[transition] = (transitions[transition] || 0) + 1;
                }
            });

            const commonTransitions: SequenceTransition[] = Object.entries(transitions)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([transition, count]) => {
                    const [from, to] = transition.split(' -> ');
                    return { from, to, count };
                });

            return {
                sessionsCount: sessions.length,
                avgPathLength,
                avgDuration,
                commonTransitions,
                sessions,
                paths
            };
        });

        return {
            totalSessions: sessions.length,
            clustersCount: uniqueClusters.size,
            averageSimilarity: similarities.reduce((sum: number, s) =>
                sum + s.similarity, 0) / similarities.length,
            clusters: clusterStats.map((stats, index) => ({
                clusterId: index + 1,
                sessionsCount: stats.sessionsCount,
                avgPathLength: stats.avgPathLength,
                avgDuration: stats.avgDuration,
                commonTransitions: stats.commonTransitions,
                sessions: stats.sessions,
                paths: stats.paths
            }))
        };
    }





    async getSessionSimilarity(webId: number): Promise<SessionMetrics[]> {
        return await clusteringDal.getSessionSimilarity(webId);
    }

    async getGeoMetrics(webId: number): Promise<GeoMetrics[]> {
        return await clusteringDal.getGeoMetrics(webId);
    }

    async getPageSimilarity(webId: number): Promise<PageTransition[]> {
        return await clusteringDal.getPageSimilarity(webId);
    }

    async getDeviceMetrics(webId: number): Promise<DeviceMetrics[]> {
        return await clusteringDal.getDeviceMetrics(webId);
    }
}



const clusteringService = new ClusteringService();
export default clusteringService;