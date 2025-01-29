// export interface EventData {
//     duration?: number;
//     element_id?: string;
//     element_tag?: string;
//     element_class?: string;
// }

export interface Geolocation {
    city: string;
    country: string;
    region: string;
    timezone: string;
}

export interface UserAgent {
    os: string;
    browser: string;
    language: string;
    platform: string;
    userAgent: string;
    browserVersion: string;
}

export interface SessionSimilarity {
    session_a: string;
    session_b: string;
    similarity_score: number;
    common_pages: number;
    duration_diff: number;
}

export interface GeoMetrics {
    country: string;
    region: string;
    city: string;
    session_count: number;
    user_count: number;
    event_count: number;
}

export interface PageSimilarity {
    source_url: string;
    target_url: string;
    transition_count: number;
    avg_duration: number;
}

export interface DeviceMetrics {
    os: string;
    browser: string;
    platform: string;
    session_count: number;
    user_count: number;
}