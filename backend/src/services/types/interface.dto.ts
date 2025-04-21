export type TimeRange = '24h' | '7d' | '30d';

export interface InteractionData {
    x: number;
    y: number;
    duration: number;
    element_type: string;
    element_text: string;
    timestamp: string;
    session_id: string;
}

export interface ScrollData {
    scroll_percentage: number;
    timestamp: string;
    session_id: string;
}

export interface ElementStats {
    type: string;
    count: number;
    avg_duration: number;
    engagement: number;
}