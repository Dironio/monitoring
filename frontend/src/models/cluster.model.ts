export interface ClusterMetrics {
    silhouetteScore: number;
    daviesBouldinIndex: number;
    clusterSizes: number[];
}

export interface ClusterPoint {
    x_coord: number;
    y_coord: number;
    cluster_id: number;
}

export interface TemporalData {
    time_bucket: string;
    event_count: number;
    unique_users: number;
}

export interface ClusterData {
    clusters: ClusterPoint[][];
    metrics: ClusterMetrics;
}

export interface AnalysisRecommendation {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    recommendations: string[];
}