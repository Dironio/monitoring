// export interface ClusterInteraction {
//     clusters: Array<{
//         x_coord: number;
//         y_coord: number;
//         duration: number;
//         sessionCount: number;
//         clusterId: number;
//     }>;
//     metrics: {
//         silhouetteScore: number;
//         daviesBouldinIndex: number;
//         clusterSizes: number[];
//     };
// }

// export interface ClusterInteraction {
//     cluster_id: number;
//     x_coords: number[];
//     y_coords: number[];
//     durations: number[];
//     session_ids: string[];
//     cluster_size: number;
//     center_x: number;
//     center_y: number;
//     std_x: number;
//     std_y: number;
// }
export interface SessionMetrics {
    duration: number;
    interactionCount: number;
    uniqueElements: number;
    x: number;
    y: number;
}

export interface ClusterSession {
    sessionId: string;
    metrics: SessionMetrics;
}

export interface ClusterInteraction {
    cluster_id: number;
    x_coords: number[];
    y_coords: number[];
    durations: number[];
    session_ids: string[];
    session_data: {
        sessionId: string;
        metrics: SessionMetrics;
    }[];
    cluster_size: number;
    center_x: number;
    center_y: number;
    std_x: number;
    std_y: number;
}