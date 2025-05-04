import { UMAPUserEvent } from "../UmapTypes";


export const tempData: UMAPUserEvent[] = [
    {
        id: 25390,
        user_id: 5,
        event_data: {
            duration: 1538,
            scrollTop: 3223,
            scrollPercentage: 100
        },
        page_url: "http://localhost:3000/models/sequence",
        timestamp: "2025-05-03 00:13:21.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 4,
        created_at: "2025-05-03 00:13:20.763 +0500",
        updated_at: "2025-05-03 00:13:20.763 +0500"
    },
    {
        id: 25389,
        user_id: 5,
        event_data: {
            duration: 1536,
            scrollTop: 2300,
            scrollPercentage: 71.36
        },
        page_url: "http://localhost:3000/models/sequence",
        timestamp: "2025-05-03 00:13:18.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 4,
        created_at: "2025-05-03 00:13:18.368 +0500",
        updated_at: "2025-05-03 00:13:18.368 +0500"
    },
    {
        id: 25388,
        user_id: 5,
        event_data: {
            x: 499,
            y: 123,
            id: null,
            tag: "BUTTON",
            text: "Анализ последовательностей",
            classes: "nav-item selected",
            duration: 1446
        },
        page_url: "http://localhost:3000/models/sequence",
        timestamp: "2025-05-03 00:11:48.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 2,
        created_at: "2025-05-03 00:11:48.198 +0500",
        updated_at: "2025-05-03 00:11:48.198 +0500"
    },
    {
        id: 25387,
        user_id: 5,
        event_data: {
            x: 686,
            y: 116,
            id: null,
            tag: "BUTTON",
            text: "Метрики сходства",
            classes: "nav-item selected",
            duration: 1438
        },
        page_url: "http://localhost:3000/models/similarity",
        timestamp: "2025-05-03 00:11:39.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 2,
        created_at: "2025-05-03 00:11:39.503 +0500",
        updated_at: "2025-05-03 00:11:39.503 +0500"
    }
];

export const prepareDataForUMAP = (events: UMAPUserEvent[]): number[][] => {
    const normalize = (value: number, min: number, max: number): number => {
        return max === min ? 0.5 : (value - min) / (max - min);
    };

    const allFeatures = events.map(event => {
        const data = event.event_data;
        return [
            data.duration || 0,
            data.scrollTop || 0,
            data.scrollPercentage || 0,
            data.x || 0,
            data.y || 0,
            event.event_id,
            new Date(event.timestamp).getTime() / 1000
        ];
    });

    const featureRanges = allFeatures[0].map((_, i) => {
        const values = allFeatures.map(f => f[i]);
        return {
            min: Math.min(...values),
            max: Math.max(...values)
        };
    });

    return allFeatures.map(features =>
        features.map((value, i) => normalize(value, featureRanges[i].min, featureRanges[i].max))
    );
};