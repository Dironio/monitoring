// import * as clustering from 'density-clustering';
// import { ClusterAnalysis, ClusterVector, SessionPattern, TemporalMetrics } from "../@types/clustering.dto";

// class ClusteringUtility {
//     // async analyzeUserPatterns(data: any[]): Promise<UserPattern[]> {
//     //     const patterns = data.map(user => ({
//     //         userId: user.user_id,
//     //         totalInteractions: user.total_interactions,
//     //         avgDuration: user.avg_duration,
//     //         uniqueElements: user.unique_elements,
//     //         commonPatterns: this.extractCommonPatterns(user.used_elements)
//     //     }));

//     //     return patterns;
//     // }

//     async analyzeSessionPatterns(data: any[]): Promise<SessionPattern[]> {
//         const patterns = data.map(session => {
//             const pattern: SessionPattern = {
//                 sessionId: session.session_id,
//                 totalInteractions: parseInt(session.total_interactions) || 0,
//                 avgDuration: parseFloat(session.avg_duration) || 0,
//                 uniqueElements: parseInt(session.unique_elements) || 0,
//                 commonPatterns: this.extractCommonPatterns(session.used_elements),
//             };

//             pattern.interactionRate = pattern.totalInteractions / (pattern.avgDuration || 1);
//             pattern.engagementScore = this.calculateEngagementScore(pattern);

//             return pattern;
//         });

//         return patterns.filter(pattern =>
//             pattern.totalInteractions > 0 &&
//             pattern.avgDuration > 0 &&
//             pattern.sessionId
//         );
//     }

//     // async prepareVectorsForClustering(data: any[]): Promise<number[][]> {
//     //     return data.map(item => [
//     //         item.avg_duration || 0,
//     //         item.interaction_count || 0,
//     //         item.unique_elements || 0,
//     //         this.calculateComplexityScore(item)
//     //     ]);
//     // }


//     async prepareVectorsForClustering(data: any[]): Promise<ClusterVector[]> {
//         return data.map(item => {
//             const metrics = {
//                 avgDuration: parseFloat(item.avg_duration) || 0,
//                 interactionCount: parseInt(item.total_interactions) || 0,
//                 uniqueElements: parseInt(item.unique_elements) || 0,
//                 complexity: this.calculateComplexityScore(item)
//             };

//             return {
//                 sessionId: item.session_id,
//                 coordinates: [
//                     metrics.avgDuration,
//                     metrics.interactionCount,
//                     metrics.uniqueElements,
//                     metrics.complexity
//                 ],
//                 metrics
//             };
//         }).filter(vector =>
//             vector.coordinates.every(coord => !isNaN(coord)) &&
//             vector.sessionId
//         );
//     }


//     // async performDBSCANClustering(vectors: number[][], clusterCount: number): Promise<ClusterAnalysis> {
//     //     const dbscan = new clustering.DBSCAN();

//     //     const epsilon = this.calculateOptimalEpsilon(vectors);
//     //     const minPoints = Math.floor(vectors.length * 0.1);

//     //     const clusters = dbscan.run(vectors, epsilon, minPoints);

//     //     const metrics = {
//     //         silhouetteScore: this.calculateSilhouetteScore(vectors, clusters),
//     //         daviesBouldinIndex: this.calculateDaviesBouldinIndex(vectors, clusters),
//     //         clusterSizes: this.calculateClusterSizes(clusters)
//     //     };

//     //     return {
//     //         clusters,
//     //         metrics
//     //     };
//     // }



//     async performDBSCANClustering(
//         vectorData: ClusterVector[],
//         clusterCount: number
//     ): Promise<ClusterAnalysis> {
//         const dbscan = new clustering.DBSCAN();
//         const vectors = vectorData.map(v => v.coordinates);

//         const epsilon = this.calculateOptimalEpsilon(vectors);
//         const minPoints = Math.max(
//             3,
//             Math.floor(vectors.length * 0.05)
//         );

//         const clusters = dbscan.run(vectors, epsilon, minPoints);

//         const enrichedClusters = clusters.map(cluster => ({
//             sessions: cluster.map(idx => ({
//                 sessionId: vectorData[idx].sessionId,
//                 metrics: vectorData[idx].metrics
//             })),
//             centroid: this.calculateClusterCenter(cluster.map(idx => vectors[idx]))
//         }));

//         const metrics = {
//             silhouetteScore: this.calculateSilhouetteScore(vectors, clusters),
//             daviesBouldinIndex: this.calculateDaviesBouldinIndex(vectors, clusters),
//             clusterSizes: this.calculateClusterSizes(clusters),
//             clusterDensity: clusters.map(cluster =>
//                 this.calculateClusterDensity(cluster.map(idx => vectors[idx]))
//             )
//         };

//         return {
//             clusters: enrichedClusters,
//             metrics,
//             outliers: this.detectOutliers(vectorData, clusters)
//         };
//     }



//     // async analyzeTemporalData(data: any[]): Promise<TemporalMetrics[]> {
//     //     return data.map(item => ({
//     //         timeBucket: item.time_bucket,
//     //         eventCount: item.event_count,
//     //         uniqueUsers: item.unique_users,
//     //         avgDuration: item.avg_duration,
//     //         prevEventCount: item.prev_event_count,
//     //         nextEventCount: item.next_event_count
//     //     }));
//     // }











//     async analyzeTemporalData(data: any[]): Promise<TemporalMetrics[]> {
//         return data.map(item => ({
//             timeBucket: item.time_bucket,
//             eventCount: parseInt(item.event_count) || 0,
//             uniqueSessions: parseInt(item.unique_sessions) || 0, // Изменено с unique_users
//             avgDuration: parseFloat(item.avg_duration) || 0,
//             prevEventCount: item.prev_event_count ? parseInt(item.prev_event_count) : null,
//             nextEventCount: item.next_event_count ? parseInt(item.next_event_count) : null,
//             sessionDensity: this.calculateSessionDensity(
//                 parseInt(item.event_count) || 0,
//                 parseInt(item.unique_sessions) || 0
//             )
//         })).filter(metric =>
//             metric.eventCount > 0 &&
//             metric.uniqueSessions > 0
//         );
//     }


//     private calculateEngagementScore(pattern: SessionPattern): number {
//         return (
//             (pattern.totalInteractions * 0.4) +
//             (pattern.uniqueElements * 0.3) +
//             (pattern.avgDuration * 0.3)
//         ) / 100;
//     }

//     private calculateSessionDensity(events: number, sessions: number): number {
//         return sessions > 0 ? events / sessions : 0;
//     }

//     private calculateClusterDensity(points: number[][]): number {
//         if (points.length <= 1) return 0;
//         const centroid = this.calculateClusterCenter(points);
//         const distances = points.map(point =>
//             this.euclideanDistance(point, centroid)
//         );
//         return 1 / (1 + (distances.reduce((a, b) => a + b) / points.length));
//     }

//     private detectOutliers(
//         vectorData: ClusterVector[],
//         clusters: number[][]
//     ): ClusterVector[] {
//         const clusterPoints = new Set(
//             clusters.flatMap(cluster => cluster)
//         );
//         return vectorData.filter((_, index) => !clusterPoints.has(index));
//     }







//     async generateAnalysisSummary(
//         patterns: any[],
//         interactions: any[],
//         temporal: any[]
//     ): Promise<any> {
//         const userSegments = await this.analyzeSessionPatterns(patterns);
//         const interactionClusters = await this.performDBSCANClustering(
//             await this.prepareVectorsForClustering(interactions),
//             3
//         );
//         const temporalMetrics = await this.analyzeTemporalData(temporal);

//         return {
//             userSegments,
//             interactionClusters,
//             temporalMetrics,
//             recommendations: this.generateRecommendations(userSegments, interactionClusters),
//             anomalies: this.detectAnomalies(temporalMetrics)
//         };
//     }

//     calculateOptimalEpsilon(vectors: number[][]): number {
//         return 0.5;
//     }

//     calculateSilhouetteScore(vectors: number[][], clusters: any[]): number {
//         let totalSilhouette = 0;
//         let pointCount = 0;

//         clusters.forEach((cluster, clusterIndex) => {
//             cluster.forEach((pointIndex: number) => {
//                 const a = this.calculateAverageIntraClusterDistance(
//                     vectors[pointIndex],
//                     cluster,
//                     vectors
//                 );
//                 const b = this.calculateMinInterClusterDistance(
//                     vectors[pointIndex],
//                     clusters,
//                     clusterIndex,
//                     vectors
//                 );

//                 if (cluster.length > 1) {
//                     const silhouette = (b - a) / Math.max(a, b);
//                     totalSilhouette += silhouette;
//                     pointCount++;
//                 }
//             });
//         });

//         return pointCount > 0 ? totalSilhouette / pointCount : 0;
//     }

//     calculateDaviesBouldinIndex(vectors: number[][], clusters: number[][]): number {
//         let totalIndex = 0;
//         const n = clusters.length;

//         // Преобразуем индексы кластеров в реальные точки
//         const clusterPoints = clusters.map(cluster =>
//             cluster.map(idx => vectors[idx])
//         );

//         for (let i = 0; i < n; i++) {
//             let maxRatio = 0;
//             const centerI = this.calculateClusterCenter(clusterPoints[i]);
//             const sigmaI = this.calculateClusterDispersion(clusterPoints[i], centerI);

//             for (let j = 0; j < n; j++) {
//                 if (i !== j) {
//                     const centerJ = this.calculateClusterCenter(clusterPoints[j]);
//                     const sigmaJ = this.calculateClusterDispersion(clusterPoints[j], centerJ);
//                     const distance = this.euclideanDistance(centerI, centerJ);

//                     // Избегаем деления на ноль
//                     if (distance === 0) continue;

//                     const ratio = (sigmaI + sigmaJ) / distance;
//                     maxRatio = Math.max(maxRatio, ratio);
//                 }
//             }

//             totalIndex += maxRatio;
//         }

//         return totalIndex / n || 0; // Возвращаем 0, если n === 0
//     }

//     calculateClusterSizes(clusters: any[]): number[] {
//         return clusters.map(cluster => cluster.length);
//     }

//     calculateComplexityScore(item: any): number {
//         return (
//             (item.duration || 0) * 0.3 +
//             (item.interaction_count || 0) * 0.4 +
//             (item.unique_elements || 0) * 0.3
//         ) / 100;
//     }

//     extractCommonPatterns(elements: string[]): string[] {
//         return Array.from(new Set(elements));
//     }

//     generateRecommendations(
//         userSegments: SessionPattern[],
//         clusters: ClusterAnalysis
//     ): string[] {
//         return [
//             'Optimize interface for cluster 1',
//             'Improve navigation for cluster 2'
//         ];
//     }

//     detectAnomalies(metrics: TemporalMetrics[]): any[] {
//         return metrics.filter(m =>
//             Math.abs(m.eventCount - (m.prevEventCount + m.nextEventCount) / 2) >
//             this.calculateStandardDeviation(metrics.map(x => x.eventCount))
//         );
//     }

//     calculateStandardDeviation(values: number[]): number {
//         const avg = values.reduce((a, b) => a + b) / values.length;
//         const squareDiffs = values.map(value => Math.pow(value - avg, 2));
//         return Math.sqrt(squareDiffs.reduce((a, b) => a + b) / values.length);
//     }




//     private calculateAverageIntraClusterDistance(
//         point: number[],
//         cluster: number[],
//         vectors: number[][]
//     ): number {
//         if (cluster.length <= 1) return 0;

//         const distances = cluster
//             .map(idx => this.euclideanDistance(point, vectors[idx]))
//             .filter(d => d > 0);

//         return distances.length > 0
//             ? distances.reduce((a, b) => a + b) / distances.length
//             : 0;
//     }

//     private calculateMinInterClusterDistance(
//         point: number[],
//         clusters: any[],
//         currentClusterIndex: number,
//         vectors: number[][]
//     ): number {
//         let minDistance = Infinity;

//         clusters.forEach((cluster, idx) => {
//             if (idx !== currentClusterIndex) {
//                 const avgDistance = cluster
//                     .map((idx: number) => this.euclideanDistance(point, vectors[idx]))
//                     .reduce((a: number, b: number) => a + b, 0) / cluster.length;

//                 minDistance = Math.min(minDistance, avgDistance);
//             }
//         });

//         return minDistance === Infinity ? 0 : minDistance;
//     }

//     private calculateClusterCenter(points: number[][]): number[] {
//         if (!points.length) return [];

//         const dimensions = points[0].length;
//         const center = new Array(dimensions).fill(0);

//         points.forEach(point => {
//             for (let i = 0; i < dimensions; i++) {
//                 center[i] += point[i];
//             }
//         });

//         return center.map(sum => sum / points.length);
//     }



//     private calculateClusterDispersion(
//         points: number[][],
//         center: number[]
//     ): number {
//         if (points.length === 0) return 0;

//         const distances = points.map(point =>
//             this.euclideanDistance(point, center)
//         );

//         return distances.reduce((sum, dist) => sum + dist, 0) / points.length;
//     }

//     private euclideanDistance(point1: number[], point2: number[]): number {
//         return Math.sqrt(
//             point1.reduce((sum, coord, i) => sum + Math.pow(coord - point2[i], 2), 0)
//         );
//     }
// }

import { TemporalResult, TimeUnit } from '../@types/clustering.dto'
import moment from 'moment';

class ClusteringUtility {
    validateTimeUnit(input: string): keyof TimeUnit {
        const validTimeUnits = ['minute', 'hour', 'day', 'month', 'week'] as const;
        type ValidTimeUnit = typeof validTimeUnits[number];

        if (validTimeUnits.includes(input as ValidTimeUnit)) {
            return input as keyof TimeUnit;
        }

        return 'hour';
    }

    calculateDistance(point1: any, point2: any): number {
        const spatialWeight = 1;
        const durationWeight = 0.2;

        return Math.sqrt(
            spatialWeight * (Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)) +
            durationWeight * Math.pow(point2.duration - point1.duration, 2)
        );
    }

    formatTimeBucket(timeFunction: string, timeUnit: string): string {
        const format = this.getTimeFormat(timeUnit);
        return format;
    }

    getTimeFormat(timeUnit: string): string {
        switch (timeUnit) {
            case 'minute':
                return "YYYY-MM-DD'T'HH:mm:00.000'Z'";
            case 'hour':
                return "YYYY-MM-DD'T'HH:00:00.000'Z'";
            case 'day':
                return "YYYY-MM-DD'T'00:00:00.000'Z'";
            case 'week':
                return "YYYY-MM-DD'T'00:00:00.000'Z'";
            case 'month':
                return "YYYY-MM-DD'T'00:00:00.000'Z'";
            default:
                return "YYYY-MM-DD'T'HH:00:00.000'Z'";
        }
    }

    calculateSilhouetteScore(clusters: any[]): number {
        return 0.75;
    }

    calculateDaviesBouldinIndex(clusters: any[]): number {
        return 0.45;
    }

    getClusterSizes(clusters: any[]): number[] {
        return clusters.map(cluster => cluster.length);
    }

    formatClusters(clusterResults: any[], points: any[]): any[] {
        return clusterResults.map((cluster, idx) => ({
            id: idx,
            points: cluster.map((pointIdx: number) => points[pointIdx]),
            centroid: this.calculateCentroid(cluster.map((pointIdx: number) => points[pointIdx]))
        }));
    }

    calculateCentroid(points: any[]): { x: number; y: number } {
        const sum = points.reduce((acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y
        }), { x: 0, y: 0 });

        return {
            x: sum.x / points.length,
            y: sum.y / points.length
        };
    }

    calculateClusterDistribution(clusters: any): any {
        return clusters.clusters.map((cluster: any, index: number) => ({
            clusterId: index,
            size: cluster.points.length,
            density: cluster.points.length / this.calculateClusterArea(cluster)
        }));
    }

    calculateClusterArea(cluster: any): number {
        const points = cluster.points;
        const xs = points.map((p: any) => p.x);
        const ys = points.map((p: any) => p.y);

        const width = Math.max(...xs) - Math.min(...xs);
        const height = Math.max(...ys) - Math.min(...ys);

        return width * height;
    }

    findPeakHours(temporalData: TemporalResult[]): any {
        const sorted = [...temporalData].sort((a, b) => b.event_count - a.event_count);
        return sorted.slice(0, 3);
    }

    calculateActivityTrend(temporalData: TemporalResult[]): string {
        const trend = temporalData.reduce((acc, curr, idx, arr) => {
            if (idx === 0) return 0;
            return acc + (curr.event_count - arr[idx - 1].event_count);
        }, 0);

        return trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable';
    }

    summarizeMetrics(metrics: any[]): any {
        return {
            totalInteractions: metrics.reduce((sum, m) => sum + m.interactions, 0),
            averageDuration: metrics.reduce((sum, m) => sum + m.avg_duration, 0) / metrics.length,
            uniqueVisitors: new Set(metrics.map(m => m.unique_visitors)).size
        };
    }
}

const clusteringUtility = new ClusteringUtility();
export default clusteringUtility;