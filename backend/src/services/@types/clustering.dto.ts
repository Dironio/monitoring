// export interface SessionPattern {
//     sessionId: string;
//     totalInteractions: number;
//     avgDuration: number;
//     uniqueElements: number;
//     commonPatterns: string[];
//     interactionRate?: number;
//     engagementScore?: number;
// }

// export interface ClusterVector {
//     sessionId: string;
//     coordinates: number[];
//     metrics: {
//         avgDuration: number;
//         interactionCount: number;
//         uniqueElements: number;
//         complexity: number;
//     };
// }

// export interface ClusterAnalysis {
//     clusters: Array<{
//         sessions: Array<{
//             sessionId: string;
//             metrics: {
//                 avgDuration: number;
//                 interactionCount: number;
//                 uniqueElements: number;
//                 complexity: number;
//             };
//         }>;
//         centroid: number[];
//     }>;
//     metrics: {
//         silhouetteScore: number;
//         daviesBouldinIndex: number;
//         clusterSizes: number[];
//         clusterDensity: number[];
//     };
//     outliers: ClusterVector[];
// }

// export interface ClusterAnalysis {
//     clusters: {
//         sessions: Array<{
//             sessionId: string;
//             metrics: {
//                 avgDuration: number;
//                 interactionCount: number;
//                 uniqueElements: number;
//                 x: number;
//                 y: number;
//             };
//         }>;
//         centroid: [number, number];
//     }[];
//     metrics: {
//         silhouetteScore: number;
//         daviesBouldinIndex: number;
//         clusterSizes: number[];
//         clusterDensity: number[];
//     };
//     outliers: any[];
// }

// export interface ClusterSession {
//     sessionId: string;
//     metrics: SessionMetrics;
// }

// export interface SessionMetrics {
//     duration: number;
//     interactionCount: number;
//     uniqueElements: number;
//     x: number;
//     y: number;
// }

// export interface Cluster {
//     sessions: ClusterSession[];
//     centroid: [number, number];
// }

// export interface ClusterAnalysis {
//     clusters: Cluster[];
//     metrics: {
//         silhouetteScore: number;
//         daviesBouldinIndex: number;
//         clusterSizes: number[];
//         clusterDensity: number[];
//     };
//     outliers: any[];
// }

// export interface TemporalMetrics {
//     timeBucket: string;
//     eventCount: number;
//     uniqueSessions: number;
//     avgDuration: number;
//     prevEventCount: number | null;
//     nextEventCount: number | null;
//     sessionDensity: number;
// }



// export interface RawSessionData {
//     sessionId: string;
//     metrics: {
//         duration: number;
//         interactionCount: number;
//         uniqueElements: number;
//         x: number;
//         y: number;
//     };
// }

// export interface SessionMetrics {
//     avgDuration: number;
//     interactionCount: number;
//     uniqueElements: number;
//     x: number;
//     y: number;
// }

// export interface ClusterSession {
//     sessionId: string;
//     metrics: SessionMetrics;
// }

// export interface Cluster {
//     sessions: ClusterSession[];
//     centroid: [number, number];
// }

// export interface ClusterAnalysis {
//     clusters: Cluster[];
//     metrics: {
//         silhouetteScore: number;
//         daviesBouldinIndex: number;
//         clusterSizes: number[];
//         clusterDensity: number[];
//     };
//     outliers: any[];
// }

// export interface ClusterInteraction {
//     cluster_id: number;
//     x_coords: number[];
//     y_coords: number[];
//     durations: number[];
//     session_ids: string[];
//     session_data: {
//         sessionId: string;
//         metrics: {
//             duration: number;
//             interactionCount: number;
//             uniqueElements: number;
//             x: number;
//             y: number;
//         };
//     }[];
//     cluster_size: number;
//     center_x: number;
//     center_y: number;
//     std_x: number;
//     std_y: number;
// }



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

// export type TimeUnit = 'minute' | 'hour' | 'day' | 'month' | 'week';

export interface TimeUnit {
    minute: string;
    hour: string;
    day: string;
    month: string;
    week: string;
}



























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