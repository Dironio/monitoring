export interface UserAgent {
    os?: string;
    browser?: string;
    language?: string;
    platform?: string;
    userAgent?: string;
    browserVersion?: string;
}

export interface Geolocation {
    ip?: string;
    loc?: string;
    org?: string;
    city?: string;
    postal?: string;
    region?: string;
    country?: string;
    timezone?: string;
}

export interface SessionSummary {
    session_id: string;
    session_start: string;
    total_duration: number;
    pages_visited: number;
    events_count: number;
    traffic_source: string | null;
    details: {
        id: number;
        event_data: any;
        page_url: string;
        timestamp: string;
        referrer: string | null;
        geolocation: Geolocation | null;
        user_agent: UserAgent | null;
    }[];
}

export interface PageAnalytics {
    page_url: string;
    views: number;
    avg_interaction_time: number;
}

export interface InteractionAnalytics {
    element_type: string;
    interactions_count: number;
    avg_duration: number;
}

export interface TimeInterval {
    time_range: string;
    count: number;
}

export const mockSessionHistory: SessionSummary[] = [
    {
        session_id: 'gbryesgfyw9',
        session_start: '2025-02-10T09:30:00',
        total_duration: 420,
        pages_visited: 6,
        events_count: 18,
        traffic_source: 'direct',
        details: [
            {
                id: 20042,
                event_data: { duration: 0 },
                page_url: 'http://localhost:4000/',
                timestamp: '2025-02-10T09:30:00',
                referrer: 'http://localhost:3000/',
                geolocation: {
                    ip: '195.133.44.85',
                    loc: '50.1155,8.6842',
                    org: 'AS215346 Big Data Host LLC',
                    city: 'Frankfurt am Main',
                    postal: '60306',
                    region: 'Hesse',
                    country: 'DE',
                    timezone: 'Europe/Berlin'
                },
                user_agent: {
                    os: 'Windows',
                    browser: 'chrome',
                    language: 'ru',
                    platform: 'Win32',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
                    browserVersion: '134'
                }
            },
            {
                id: 20041,
                event_data: { duration: 116 },
                page_url: 'http://localhost:4000/',
                timestamp: '2025-02-10T09:30:10',
                referrer: null,
                geolocation: {
                    ip: '195.133.44.85',
                    loc: '50.1155,8.6842',
                    org: 'AS215346 Big Data Host LLC',
                    city: 'Frankfurt am Main',
                    postal: '60306',
                    region: 'Hesse',
                    country: 'DE',
                    timezone: 'Europe/Berlin'
                },
                user_agent: null
            },
        ]
    },
    {
        session_id: 'gc31oqmbyfb',
        session_start: '2025-03-19T18:45:00',
        total_duration: 345,
        pages_visited: 4,
        events_count: 12,
        traffic_source: 'google',
        details: [
            {
                id: 20040,
                event_data: { form_id: null, duration: 116, form_action: 'http://localhost:3000/auth', form_method: 'get' },
                page_url: 'http://localhost:4000/',
                timestamp: '2025-03-19T18:45:37',
                referrer: null,
                geolocation: null,
                user_agent: null
            },
            {
                id: 20039,
                event_data: { x: 947, y: 575, id: null, tag: 'BUTTON', text: 'Войти', classes: 'auth__signup-btn', duration: 116 },
                page_url: 'http://localhost:4000/',
                timestamp: '2025-03-19T18:45:37',
                referrer: null,
                geolocation: null,
                user_agent: null
            },
            {
                id: 20038,
                event_data: { x: 870, y: 406, id: null, tag: 'INPUT', text: null, classes: 'input-control', duration: 113 },
                page_url: 'http://localhost:4000/',
                timestamp: '2025-03-19T18:45:33',
                referrer: null,
                geolocation: null,
                user_agent: null
            },
        ]
    },
    {
        session_id: 'xyz789abc123',
        session_start: '2025-04-15T14:20:00',
        total_duration: 600,
        pages_visited: 7,
        events_count: 20,
        traffic_source: 'social',
        details: [
            {
                id: 20043,
                event_data: { duration: 150 },
                page_url: 'http://localhost:4000/products',
                timestamp: '2025-04-15T14:20:10',
                referrer: 'http://facebook.com',
                geolocation: {
                    ip: '192.168.1.1',
                    loc: '40.7128,-74.0060',
                    org: 'AS12345 Internet Provider',
                    city: 'New York',
                    postal: '10001',
                    region: 'New York',
                    country: 'US',
                    timezone: 'America/New_York'
                },
                user_agent: {
                    os: 'MacOS',
                    browser: 'safari',
                    language: 'en',
                    platform: 'MacIntel',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
                    browserVersion: '14.1.2'
                }
            },
        ]
    },
    {
        session_id: 'pqr456stu789',
        session_start: '2025-05-01T10:15:00',
        total_duration: 280,
        pages_visited: 3,
        events_count: 10,
        traffic_source: 'referral',
        details: [
            {
                id: 20044,
                event_data: { x: 500, y: 300, id: 'login-btn', tag: 'BUTTON', text: 'Login', classes: 'btn-login', duration: 90 },
                page_url: 'http://localhost:4000/login',
                timestamp: '2025-05-01T10:15:05',
                referrer: 'http://example.com',
                geolocation: {
                    ip: '185.220.101.1',
                    loc: '51.5074,-0.1278',
                    org: 'AS67890 Cloud Provider',
                    city: 'London',
                    postal: 'SW1A 1AA',
                    region: 'England',
                    country: 'GB',
                    timezone: 'Europe/London'
                },
                user_agent: {
                    os: 'Linux',
                    browser: 'firefox',
                    language: 'en-GB',
                    platform: 'Linux x86_64',
                    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
                    browserVersion: '89.0'
                }
            },
        ]
    },
];

export const mockPageAnalytics: PageAnalytics[] = [
    { page_url: '/home', views: 150, avg_interaction_time: 50 },
    { page_url: '/products', views: 120, avg_interaction_time: 70 },
    { page_url: '/login', views: 80, avg_interaction_time: 30 },
    { page_url: '/contact', views: 60, avg_interaction_time: 40 },
];

export const mockInteractionAnalytics: InteractionAnalytics[] = [
    { element_type: 'button', interactions_count: 70, avg_duration: 3 },
    { element_type: 'form', interactions_count: 50, avg_duration: 50 },
    { element_type: 'link', interactions_count: 30, avg_duration: 2 },
    { element_type: 'input', interactions_count: 40, avg_duration: 10 },
];

export const mockTimeIntervals: TimeInterval[] = [
    { time_range: '0-30 сек', count: 120 },
    { time_range: '30-60 сек', count: 90 },
    { time_range: '60-120 сек', count: 60 },
    { time_range: '120+ сек', count: 30 },
];