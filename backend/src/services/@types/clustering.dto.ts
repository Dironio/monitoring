export interface ClusteringData {
    x: number;
    y: number;
    duration: number;
    page_url: string;
    timestamp: Date;
    session_id: string;
}

export interface ClusterResult {
    clusters: any[];
    metrics: {
        silhouetteScore: number;
        daviesBouldinIndex: number;
        clusterSizes: number[];
    };
}

export interface TemporalResult {
    time_bucket: string;
    event_count: number;
    unique_users: number;
}

export interface InteractionData {
    x: number;
    y: number;
    duration: number;
    page_url: string;
    timestamp: Date;
    session_id: string;
}

export interface TemporalData {
    time_bucket: string;
    event_count: number;
    unique_users: number;
}

export interface TimeUnit {
    minute: string;
    hour: string;
    day: string;
    month: string;
    week: string;
}










// К средние



export interface UserMetrics {
    sessionId: string;
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
}



export interface SequenceTransition {
    from: string;
    to: string;
    count: number;
}

export interface SequenceCluster {
    clusterId: number;
    sessionsCount: number;
    avgPathLength: number;
    avgDuration: number;
    commonTransitions: SequenceTransition[];
    sessions: string[];
    paths: string[][];
}

export interface SequenceAnalysis {
    totalSessions: number;
    clustersCount: number;
    averageSimilarity: number;
    clusters: SequenceCluster[];
}



// Сходства


export interface PageTransition {
    source_url: string;
    target_url: string;
    transition_count: number;
    avg_duration: number;
    min_duration: number;
    max_duration: number;
}

export interface GeoMetrics {
    country: string;
    region: string;
    city: string;
    session_count: number;
    user_count: number;
    event_count: number;
}

export interface DeviceMetrics {
    os: string;
    browser: string;
    platform: string;
    session_count: number;
    user_count: number;
}

export interface SessionMetrics {
    session_id: string;
    event_count: number;
    duration: number;
    start_time: string;
    end_time: string;
    page_count: number;
}