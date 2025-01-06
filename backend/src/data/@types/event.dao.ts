export interface CreateEventDao {
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

export interface GetEventsDao {
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

export interface UpdateEventDao {
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