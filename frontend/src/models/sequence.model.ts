export interface SequenceEvent {
    pageUrl: string;
    timestamp: Date;
    eventType: number;
    duration: number;
}

export interface PathSequence {
    path: string[];
    frequency: number;
    avgDuration: number;
}

export interface TransitionMatrix {
    nodes: string[];
    transitions: number[][];
}

export interface PathDetails {
    from: string;
    to: string;
    count: number;
    avgDuration: number;
}

export interface EventSequence {
    clusterId: number;
    sessionsCount: number;
    avgPathLength: number;
    avgDuration: number;
    commonTransitions: {
        from: string;
        to: string;
        count: number;
    }[];
    sessions: string[];
    paths: string[][];
}

export interface SequenceAnalysis {
    totalSessions: number;
    clustersCount: number;
    averageSimilarity: number;
    clusters: EventSequence[];
    commonPaths: PathSequence[];
    pathDetails?: PathDetails[];
}