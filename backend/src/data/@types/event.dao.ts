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
    user_agent?: string;
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
    user_agent?: string;
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
    user_agent?: string;
}




export interface ClickHeatmapData {
    eventData: {
        x: number;
        y: number;
    };
    clickCount: number;
}

export interface ScrollHeatmapData {
    event_data: {
        scrollTop: number;
        scrollPercentage: number;
    };
    scroll_count: number;
}