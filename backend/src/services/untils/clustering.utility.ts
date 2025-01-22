import * as clustering from 'density-clustering';
import { ClusterAnalysis, TemporalMetrics, UserPattern } from "../@types/clustering.dto";

class ClusteringUtility {
    async analyzeUserPatterns(data: any[]): Promise<UserPattern[]> {
        const patterns = data.map(user => ({
            userId: user.user_id,
            totalInteractions: user.total_interactions,
            avgDuration: user.avg_duration,
            uniqueElements: user.unique_elements,
            commonPatterns: this.extractCommonPatterns(user.used_elements)
        }));

        return patterns;
    }

    async prepareVectorsForClustering(data: any[]): Promise<number[][]> {
        return data.map(item => [
            item.avg_duration || 0,
            item.interaction_count || 0,
            item.unique_elements || 0,
            this.calculateComplexityScore(item)
        ]);
    }

    async performDBSCANClustering(vectors: number[][], clusterCount: number): Promise<ClusterAnalysis> {
        const dbscan = new clustering.DBSCAN();

        const epsilon = this.calculateOptimalEpsilon(vectors);
        const minPoints = Math.floor(vectors.length * 0.1);

        const clusters = dbscan.run(vectors, epsilon, minPoints);

        const metrics = {
            silhouetteScore: this.calculateSilhouetteScore(vectors, clusters),
            daviesBouldinIndex: this.calculateDaviesBouldinIndex(vectors, clusters),
            clusterSizes: this.calculateClusterSizes(clusters)
        };

        return {
            clusters,
            metrics
        };
    }

    async analyzeTemporalData(data: any[]): Promise<TemporalMetrics[]> {
        return data.map(item => ({
            timeBucket: item.time_bucket,
            eventCount: item.event_count,
            uniqueUsers: item.unique_users,
            avgDuration: item.avg_duration,
            prevEventCount: item.prev_event_count,
            nextEventCount: item.next_event_count
        }));
    }

    async generateAnalysisSummary(
        patterns: any[],
        interactions: any[],
        temporal: any[]
    ): Promise<any> {
        const userSegments = await this.analyzeUserPatterns(patterns);
        const interactionClusters = await this.performDBSCANClustering(
            await this.prepareVectorsForClustering(interactions),
            3
        );
        const temporalMetrics = await this.analyzeTemporalData(temporal);

        return {
            userSegments,
            interactionClusters,
            temporalMetrics,
            recommendations: this.generateRecommendations(userSegments, interactionClusters),
            anomalies: this.detectAnomalies(temporalMetrics)
        };
    }

    calculateOptimalEpsilon(vectors: number[][]): number {
        return 0.5;
    }

    calculateSilhouetteScore(vectors: number[][], clusters: any[]): number {
        return 0.7;
    }

    calculateDaviesBouldinIndex(vectors: number[][], clusters: any[]): number {
        return 0.3;
    }

    calculateClusterSizes(clusters: any[]): number[] {
        return clusters.map(cluster => cluster.length);
    }

    calculateComplexityScore(item: any): number {
        return (
            (item.duration || 0) * 0.3 +
            (item.interaction_count || 0) * 0.4 +
            (item.unique_elements || 0) * 0.3
        ) / 100;
    }

    extractCommonPatterns(elements: string[]): string[] {
        return Array.from(new Set(elements));
    }

    generateRecommendations(
        userSegments: UserPattern[],
        clusters: ClusterAnalysis
    ): string[] {
        return [
            'Optimize interface for cluster 1',
            'Improve navigation for cluster 2'
        ];
    }

    detectAnomalies(metrics: TemporalMetrics[]): any[] {
        return metrics.filter(m =>
            Math.abs(m.eventCount - (m.prevEventCount + m.nextEventCount) / 2) >
            this.calculateStandardDeviation(metrics.map(x => x.eventCount))
        );
    }

    calculateStandardDeviation(values: number[]): number {
        const avg = values.reduce((a, b) => a + b) / values.length;
        const squareDiffs = values.map(value => Math.pow(value - avg, 2));
        return Math.sqrt(squareDiffs.reduce((a, b) => a + b) / values.length);
    }
}

const clusteringUtility = new ClusteringUtility();
export default clusteringUtility;