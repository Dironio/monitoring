import './AverageTimeComponent.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { User } from "../../../../models/user.model";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AverageTimeComponentProps {
    user: User | null;
    loading: boolean;
}

interface AverageTimeMetric {
    day: string;
    avg_session_time: number;
    max_session_time: number;
    total_site_time: number;
    total_sessions: number;
}

const AverageTimeComponent: React.FC<AverageTimeComponentProps> = ({ user, loading }) => {
    const [metrics, setMetrics] = useState<AverageTimeMetric[]>([]);
    const [expanded, setExpanded] = useState(false);
    const COLORS = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
        "hsl(var(--chart-6))",
    ];


    const formatTime = (time: number) => {
        if (time > 60) {
            return `${(time / 60).toFixed(2)} минуты`;
        }
        return `${time.toFixed(2)} секунды`;
    };

    useEffect(() => {
        if (loading) return;
        if (!user) {
            console.error("Пользователь не авторизован");
            return;
        }

        const fetchMetrics = async () => {
            try {
                const response = await axios.get<AverageTimeMetric[]>(
                    `${process.env.REACT_APP_API_URL}/events/main/average-time`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setMetrics(response.data);
            } catch (error) {
                console.error("Ошибка при получении метрик сайта:", error);
            }
        };

        fetchMetrics();
    }, [user, loading]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <section className="metrics-container">
            {/* Линейный график */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg">Среднее время сессий по дням</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="day"
                                tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")}
                            />
                            <YAxis />
                            <Tooltip
                                content={({ payload }) => {
                                    if (payload && payload.length) {
                                        const { avg_session_time } = payload[0].payload;
                                        return (
                                            <div>
                                                Среднее время: {formatTime(avg_session_time)}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line type="monotone" dataKey="avg_session_time" stroke="#1B998B" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Гистограмма */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg">Количество сессий по дням</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="day"
                                tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")}
                            />
                            <YAxis />
                            <Tooltip
                                content={({ payload }) => {
                                    if (payload && payload.length) {
                                        const { total_sessions } = payload[0].payload;
                                        return <div>Сессий: {total_sessions}</div>;
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="total_sessions" fill="#FF9B71" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Круговая диаграмма */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg">Общее время по дням</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={metrics}
                                dataKey="total_site_time"
                                nameKey="day"
                                label={({ name }) => format(new Date(name), "dd.MM")}
                                outerRadius={100}
                            >
                                {metrics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Раскрывающаяся таблица */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg">Данные по дням</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Среднее время</th>
                            <th>Макс. время</th>
                            <th>Общее время</th>
                            <th>Сессий</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(expanded ? metrics : metrics.slice(0, 10)).map((metric) => (
                            <tr key={metric.day}>
                                <td>{format(new Date(metric.day), "dd.MM.yyyy")}</td>
                                <td>{formatTime(metric.avg_session_time)}</td>
                                <td>{formatTime(metric.max_session_time)}</td>
                                <td>{formatTime(metric.total_site_time)}</td>
                                <td>{metric.total_sessions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {metrics.length > 10 && (
                    <button onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Свернуть" : "Развернуть"}
                    </button>
                )}
            </div>
        </section>
    );
};

export default AverageTimeComponent;