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


// К средние


export interface UserMetrics {
    sessionId: string;
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
}

export interface SequenceEvent {
    session_id: string;
    page_url: string;
    timestamp: Date;
    duration: number;
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