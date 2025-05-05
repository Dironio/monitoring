import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface VisitMetricsProps {
    queryParams: Record<string, string> | null;
    metricType: 'total' | 'unique' | 'duration' | 'history';
}

interface VisitData {
    total: number;
    unique: number;
    avgDuration: number;
    history: Array<{
        date: string;
        visits: number;
        uniqueVisitors: number;
    }>;
}

export const VisitMetrics: React.FC<VisitMetricsProps> = ({ queryParams, metricType }) => {
    const [data, setData] = useState<VisitData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!queryParams) return;

        setIsLoading(true);
        setError(null);

        // Mock API call
        setTimeout(() => {
            try {
                // Generate mock data
                const mockData: VisitData = {
                    total: Math.floor(Math.random() * 10000) + 5000,
                    unique: Math.floor(Math.random() * 5000) + 2000,
                    avgDuration: Math.floor(Math.random() * 300) + 60, // in seconds
                    history: Array.from({ length: 14 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (13 - i));
                        return {
                            date: date.toISOString().split('T')[0],
                            visits: Math.floor(Math.random() * 1000) + 200,
                            uniqueVisitors: Math.floor(Math.random() * 500) + 100
                        };
                    })
                };

                setData(mockData);
            } catch (err) {
                setError('Failed to fetch visit metrics');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 800);
    }, [queryParams]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-100 rounded-md">
                <p>{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-4 text-gray-500">
                <p>No data available</p>
            </div>
        );
    }

    if (metricType === 'total') {
        return (
            <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{data.total.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total visits in selected period</p>
            </div>
        );
    }

    if (metricType === 'unique') {
        return (
            <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{data.unique.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Unique visitors in selected period</p>
            </div>
        );
    }

    if (metricType === 'duration') {
        const minutes = Math.floor(data.avgDuration / 60);
        const seconds = data.avgDuration % 60;

        return (
            <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                    {minutes}m {seconds}s
                </p>
                <p className="text-sm text-gray-500">Average visit duration</p>
            </div>
        );
    }

    if (metricType === 'history') {
        return (
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data.history}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="visits"
                            stroke="#3B82F6"
                            name="Total Visits"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="uniqueVisitors"
                            stroke="#10B981"
                            name="Unique Visitors"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
}