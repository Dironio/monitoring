export interface ClusterAnalysis {
    clusters: any[];
    metrics: {
        silhouetteScore: number;
        daviesBouldinIndex: number;
        clusterSizes: number[];
    };
}

export interface UserPattern {
    userId: number;
    totalInteractions: number;
    avgDuration: number;
    uniqueElements: number;
    commonPatterns: string[];
}

export interface TemporalMetrics {
    timeBucket: Date;
    eventCount: number;
    uniqueUsers: number;
    avgDuration: number;
    prevEventCount: number;
    nextEventCount: number;
}
