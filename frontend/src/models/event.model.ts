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

    event_type: string;
    description: string;
}


export interface DensityPoint {
    value: number;
    density: number;
    fill: string;
}

export interface HourlyPoint {
    hour: number;
    count: number;
    fill: string;
}

export interface EventTypeStats {
    type: string;
    count: number;
    description: string;
    percentage: number;
    fill: string;
}

export interface BinMap {
    [key: number]: number;
}

export interface TypeStatsMap {
    [key: string]: number;
}




export interface PageData {
    page_url: string;
    // другие поля, если есть
}

export interface ClickData {
    x: number;
    y: number;
    count: number;
}

export interface HeatmapData {
    eventData: {
        x: number;
        y: number;
        id: string | null;
        tag: string;
        text: string | null;
        classes: string | null;
        duration: number;
    };
    clickCount: number;
}