// src/hooks/useOverviewMetrics.ts
import { useState, useEffect } from 'react';
import axios from "axios";
import { compareAsc, parse } from "date-fns";
import { MetricResponse } from '../../../models/event.model';

export interface Trend {
    trend: 'рост' | 'падение' | 'стабильность' | 'недостаточно данных';
    percentage: number;
}

export interface TrendsState {
    users: Trend;
    time: Trend;
}

export interface TopPage {
    page_url: string;
    visits: number;
}

export interface RawEvent {
    day: string;
    active_users?: number;
    avg_time?: number;
    page_url?: string;
    visits?: number;
}

export interface MetricData {
    day: string;
    value: number;
    fill: string;
}

export const useOverviewMetrics = () => {
    const [dailyActiveUsers, setDailyActiveUsers] = useState<MetricData[]>([]);
    const [averageSessionTime, setAverageSessionTime] = useState<MetricData[]>([]);
    const [topPages, setTopPages] = useState<TopPage[]>([]);
    const [trends, setTrends] = useState<TrendsState>({
        users: { trend: 'недостаточно данных', percentage: 0 },
        time: { trend: 'недостаточно данных', percentage: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calculateTrend = (data: MetricData[]): Trend => {
        if (data.length < 2) return { trend: 'недостаточно данных', percentage: 0 };

        const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.day);
            const dateB = new Date(b.day);
            return compareAsc(dateA, dateB);
        });

        const firstValue = sortedData[0].value;
        const lastValue = sortedData[sortedData.length - 1].value;
        const change = lastValue - firstValue;
        const percentage = ((change / firstValue) * 100).toFixed(1);

        if (change > 0) {
            return { trend: 'рост', percentage: Number(percentage) };
        } else if (change < 0) {
            return { trend: 'падение', percentage: Math.abs(Number(percentage)) };
        }
        return { trend: 'стабильность', percentage: 0 };
    };

    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchMetrics = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [dailyResponse, avgSessionResponse, topPagesResponse] = await Promise.all([
                    axios.get<MetricResponse[]>(
                        `${process.env.REACT_APP_API_URL}/events/main/daily?web_id=${selectedSite.value}`,
                        {
                            withCredentials: true,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                            },
                        }
                    ),
                    axios.get<MetricResponse[]>(
                        `${process.env.REACT_APP_API_URL}/events/main/duration?web_id=${selectedSite.value}`,
                        {
                            withCredentials: true,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                            },
                        }
                    ),
                    axios.get<MetricResponse[]>(
                        `${process.env.REACT_APP_API_URL}/events/main/top-pages?web_id=${selectedSite.value}`,
                        {
                            withCredentials: true,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                            },
                        }
                    )
                ]);

                const processedDailyData = dailyResponse.data
                    .map(item => ({
                        day: item.day,
                        value: Number(item.active_users) || 0,
                        fill: "hsl(var(--chart-1))"
                    }))
                    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

                const processedSessionData = avgSessionResponse.data
                    .map(item => ({
                        day: item.day,
                        value: Math.round(item.avg_time || 0),
                        fill: "hsl(var(--chart-2))"
                    }))
                    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

                setDailyActiveUsers(processedDailyData);
                setAverageSessionTime(processedSessionData);
                setTopPages(topPagesResponse.data.map(item => ({
                    page_url: item.page_url || '',
                    visits: item.visits || 0
                })));

                setTrends({
                    users: calculateTrend(processedDailyData),
                    time: calculateTrend(processedSessionData)
                });

                if (processedDailyData.length > 0) {
                    setDailyActiveUsers(processedDailyData);
                }

            } catch (error) {
                setError("Ошибка при загрузке данных");
                console.error("Ошибка при получении данных:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    useEffect(() => {
        console.log('dailyActiveUsers changed:', dailyActiveUsers);
    }, [dailyActiveUsers]);

    return {
        dailyActiveUsers,
        averageSessionTime,
        topPages,
        trends,
        loading,
        error,
        formatDuration
    };
};
