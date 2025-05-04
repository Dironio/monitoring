export interface UMAPPoint {
    x: number;
    y: number;
    label: string;
    timestamp: string;
    eventType: 'click' | 'scroll';
    pageUrl: string;
    rawData: any;
    sessionId: string;
    userSegment: string;
}

export interface UMAPUserEvent {
    id: number;
    user_id: number;
    event_data: {
        duration?: number;
        scrollTop?: number;
        scrollPercentage?: number;
        x?: number;
        y?: number;
        id?: null;
        tag?: string;
        text?: string;
        classes?: string;
    };
    page_url: string;
    timestamp: string;
    web_id: number;
    session_id: string;
    event_id: number;
    created_at: string;
    updated_at: string;
}