export interface CreateEventDao {
    user_id: number;
    product_id: number;
    analyst_id: number;
    owner_id: number;
    seller_id: number;
    web_id: number;
    event_type: string;
    event_data: any;
    page_url: string;
    timestamp: Date;
    created_at: Date;
    updated_at: Date;
}

export interface GetEventsDao { }

export interface UpdateEventDao {
    id: number;
    user_id?: number;
    product_id?: number;
    analyst_id?: number;
    owner_id?: number;
    seller_id?: number;
    web_id?: number;
    event_type?: string;
    event_data?: any;
    page_url?: string;
    timestamp?: Date;
    created_at?: Date;
    updated_at?: Date;
}