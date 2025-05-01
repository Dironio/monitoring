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

export interface InteractionEvent {
    x: number;
    y: number;
    duration: number;
    element_type: string;
    element_text: string;
    timestamp: string;
    session_id: string;
}

export interface ElementStat {
    type: string;
    count: number;
    avg_duration: number;
    engagement: number;
}

export interface HeatmapCell {
    x: number;
    y: number;
    count: number;
    elements: string[];
    avg_duration: number;
}










export interface DetailedInteraction {
    x: number;
    y: number;
    duration: number;
    element_type: string;
    element_text: string;
    element_classes: string[];
    timestamp: string;
    session_id: string;
    os: string;
    browser: string;
    platform: string;
    country: string;
    city: string;
}

export interface ElementStat {
    type: string;
    count: number;
    avg_duration: number;
    engagement: number;
    classes?: string[];
    devices_count?: number;
    locations_count?: number;
}

export interface HeatmapCell {
    x: number;
    y: number;
    count: number;
    elements: string[];
    avg_duration: number;
    element_details?: Array<{
        type: string;
        text: string;
        class: string;
    }>;
}

export interface ElementDetails {
    type: string;
    total_interactions: number;
    avg_duration: number;
    classes: { name: string; count: number }[];
    devices: { name: string; count: number }[];
    locations: { name: string; count: number }[];
    time_distribution: TimePoint[];
}

export interface ClickDetails {
    coordinates: { x: number; y: number };
    total_clicks: number;
    avg_duration: number;
    elements: ElementGroup[];
    devices: DeviceGroup[];
    locations: LocationGroup[];
    time_distribution: TimePoint[];
}









export interface ElementGroup {
    type: string;
    count: number;
    classes: string[];
    percentage: number;
}

export interface DeviceGroup {
    device: string;
    count: number;
    percentage: number;
}

export interface LocationGroup {
    location: string;
    count: number;
    percentage: number;
}

export interface TimePoint {
    time: string;
    count: number;
    normalized: number; // 0-100 для удобства отображения
}



export interface SessionInfo {
    os: string;
    browser: string;
    platform: string;
    country: string;
    city: string;
}




