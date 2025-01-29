export interface UserBehaviorData {
    sessionId: string;
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
}

export interface ClusteringConfig {
    k: number;
    maxIterations: number;
    learningRate: number;
}

export interface ClusteringResult {
    clusters: number[];
    centroids: number[][];
    error: number;
    iteration: number;
}