export interface RawEvent {
    id: number;
    user_id: number;
    product_id: number;
    analyst_id: number;
    owner_id: number;
    seller_id: number;
    web_id: number;
    event_id: string;
    event_data: string;
    page_url: string;
    timestamp: Date;
    created_at: Date;
    updated_at: Date;
    session_id: string;
    referrer: string;
    geolocation: string;
    duration: number;
}

export interface CreateEventDto {
    user_id?: number;
    product_id?: number;
    analyst_id?: number;
    owner_id?: number;
    seller_id?: number;
    web_id: number;
    event_id?: string;
    event_data?: any;
    page_url?: string;
    timestamp?: Date;
    created_at?: Date;
    updated_at?: Date;
    session_id?: string;
    referrer?: string;
    geolocation?: string;
    duration?: number;
}

export interface GetEventDto {
    id?: number;
    user_id?: number;
    product_id?: number;
    analyst_id?: number;
    owner_id?: number;
    seller_id?: number;
    web_id?: number;
    event_id?: number;
    event_type?: string;
    event_data?: any;
    page_url?: string;
    timestamp?: Date;
    created_at?: Date;
    updated_at?: Date;
    session_id?: string;
    referrer?: string;
    geolocation?: string;
    duration?: number;
}

export interface UpdateEventDto {
    id: number;
    user_id?: number;
    product_id?: number;
    analyst_id?: number;
    owner_id?: number;
    seller_id?: number;
    web_id?: number;
    event_id?: string;
    event_data?: any;
    page_url?: string;
    timestamp?: Date;
    created_at?: Date;
    updated_at?: Date;
    session_id?: string;
    referrer?: string;
    geolocation?: string;
    duration?: number;
}



export interface ClickHeatmapData {
    eventData: {
        x: number;
        y: number;
    };
    clickCount: number;
}

export interface ScrollHeatmapData {
    eventData: {
        scrollTop: number;
        scrollPercentage: number;
    };
    scrollCount: number;
}