export interface SessionPattern {
    sessionId: string;
    totalInteractions: number;
    avgDuration: number;
    uniqueElements: number;
    commonPatterns: string[];
    interactionRate?: number;
    engagementScore?: number;
}

export interface ClusterVector {
    sessionId: string;
    coordinates: number[];
    metrics: {
        avgDuration: number;
        interactionCount: number;
        uniqueElements: number;
        complexity: number;
    };
}

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

export interface TemporalMetrics {
    timeBucket: string;
    eventCount: number;
    uniqueSessions: number;
    avgDuration: number;
    prevEventCount: number | null;
    nextEventCount: number | null;
    sessionDensity: number;
}



export interface RawSessionData {
    sessionId: string;
    metrics: {
        duration: number;
        interactionCount: number;
        uniqueElements: number;
        x: number;
        y: number;
    };
}

export interface SessionMetrics {
    avgDuration: number;
    interactionCount: number;
    uniqueElements: number;
    x: number;
    y: number;
}

export interface ClusterSession {
    sessionId: string;
    metrics: SessionMetrics;
}

export interface Cluster {
    sessions: ClusterSession[];
    centroid: [number, number];
}

export interface ClusterAnalysis {
    clusters: Cluster[];
    metrics: {
        silhouetteScore: number;
        daviesBouldinIndex: number;
        clusterSizes: number[];
        clusterDensity: number[];
    };
    outliers: any[];
}

export interface ClusterInteraction {
    cluster_id: number;
    x_coords: number[];
    y_coords: number[];
    durations: number[];
    session_ids: string[];
    session_data: {
        sessionId: string;
        metrics: {
            duration: number;
            interactionCount: number;
            uniqueElements: number;
            x: number;
            y: number;
        };
    }[];
    cluster_size: number;
    center_x: number;
    center_y: number;
    std_x: number;
    std_y: number;
}