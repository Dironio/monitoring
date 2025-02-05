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
    avg_events_per_session: number;
    avg_pages_per_session: number;
    bounce_rate: number;
}

const AverageTimeComponent: React.FC<AverageTimeComponentProps> = ({ user, loading }) => {
    const [metrics, setMetrics] = useState<AverageTimeMetric[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [lineChartScale, setLineChartScale] = useState(1);
    const [barChartScale, setBarChartScale] = useState(1);
    const [pieChartScale, setPieChartScale] = useState(1);



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
            return `${(time / 60).toFixed(0)} минут`;
        }
        return `${time.toFixed(2)} секунд`;
    };

    useEffect(() => {
        if (loading) return;

        if (!user) {
            console.error("Пользователь не авторизован");
            return;
        }

        const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');

        if (!selectedSite) {
            console.error("Сайт не выбран");
            return;
        }

        const fetchMetrics = async () => {
            try {
                const response = await axios.get<AverageTimeMetric[]>(
                    `${process.env.REACT_APP_API_URL}/events/main/average-time?web_id=${selectedSite.value}`,
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                const processedData = response.data.map(item => ({
                    ...item,
                    day: new Date(item.day).toISOString(),
                    total_site_time: Math.round(Number(item.total_site_time))
                }));
                setMetrics(processedData.sort((a, b) =>
                    new Date(a.day).getTime() - new Date(b.day).getTime()
                ));
            } catch (error) {
                console.error("Ошибка при получении метрик сайта:", error);
            }
        };



        fetchMetrics();
    }, [user, loading]);

    const handleScaleChange = (chartType: string, factor: number) => {
        if (chartType === "line") {
            setLineChartScale((prev) => Math.max(0.5, Math.min(2, prev + factor)));
        } else if (chartType === "bar") {
            setBarChartScale((prev) => Math.max(0.5, Math.min(2, prev + factor)));
        } else if (chartType === "pie") {
            setPieChartScale((prev) => Math.max(0.5, Math.min(2, prev + factor)));
        }
    };

    const hasValidData = (data: AverageTimeMetric[]) => {
        return Array.isArray(data) && data.length > 0 &&
            data.every(item => typeof item.total_site_time === 'number' && !isNaN(item.total_site_time));
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <section className="average-time">
            {/* Линейный график */}
            <div className="average-time__chart">
                <h2 className="average-time__title">Среднее время сессий по дням</h2>
                <div className="average-time__scale-controls">
                    <button onClick={() => handleScaleChange("line", -0.1)}>-</button>
                    <span>Масштаб: {lineChartScale.toFixed(1)}x</span>
                    <button onClick={() => handleScaleChange("line", 0.1)}>+</button>
                </div>
                <ResponsiveContainer width="100%" height={300 * lineChartScale}>
                    <LineChart data={metrics} margin={{ top: 20, right: 30, bottom: 20, left: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")} />
                        <YAxis domain={[(dataMin: number) => Math.floor(dataMin * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.1)]} />
                        <Tooltip content={({ payload }) => payload && payload[0]?.payload && (
                            <div>Среднее время: {formatTime(payload[0].payload.avg_session_time)}</div>
                        )} />
                        <Line type="monotone" dataKey="avg_session_time" stroke="#1B998B" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Гистограмма */}
            <div className="average-time__chart">
                <h2 className="average-time__title">Количество сессий по дням</h2>
                <div className="average-time__scale-controls">
                    <button onClick={() => handleScaleChange("bar", -0.1)}>-</button>
                    <span>Масштаб: {barChartScale.toFixed(1)}x</span>
                    <button onClick={() => handleScaleChange("bar", 0.1)}>+</button>
                </div>
                <ResponsiveContainer width="100%" height={300 * barChartScale}>
                    <BarChart data={metrics} margin={{ top: 20, right: 30, bottom: 20, left: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")} />
                        <YAxis domain={[(dataMin: number) => Math.floor(dataMin * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.1)]} />
                        <Tooltip content={({ payload }) => payload && payload[0]?.payload && (
                            <div>Сессий: {payload[0].payload.total_sessions}</div>
                        )} />
                        <Bar dataKey="total_sessions" fill="#FF9B71" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Круговая диаграмма */}
            <div className="average-time__chart">
                <h2 className="average-time__title">Общее время по дням</h2>
                <div className="average-time__scale-controls">
                    <button onClick={() => handleScaleChange("pie", -0.1)}>-</button>
                    <span>Масштаб: {pieChartScale.toFixed(1)}x</span>
                    <button onClick={() => handleScaleChange("pie", 0.1)}>+</button>
                </div>
                {loading ? (
                    <div className="average-time__loading">Загрузка данных...</div>
                ) : hasValidData(metrics) ? (
                    <ResponsiveContainer width="100%" height={300 * pieChartScale}>
                        <PieChart>
                            <Pie
                                data={metrics}
                                dataKey="total_site_time"
                                nameKey="day"
                                label={({ name }) => format(new Date(name), "dd.MM")}
                                outerRadius={100 * pieChartScale}
                            >
                                {metrics.map((entry, index) => {
                                    const hue = (index * 137.508) % 360;
                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`hsl(${hue}, 70%, 50%)`}
                                        />
                                    );
                                })}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [
                                    `${Math.round(Number(value))} сек.`,
                                    "Общее время"
                                ]}
                                labelFormatter={(label) => format(new Date(label), "dd.MM.yyyy")}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="average-time__no-data">Нет данных для отображения</div>
                )}
            </div>

            {/* Таблица */}
            <div className="average-time__table-container">
                <h2 className="average-time__title">Данные по дням</h2>
                <table className="average-time__table">
                    <thead className="average-time__table-head">
                        <tr className="average-time__table-header-row">
                            <th className="average-time__table-header">Дата</th>
                            <th className="average-time__table-header">Среднее время</th>
                            <th className="average-time__table-header">Макс. время</th>
                            <th className="average-time__table-header">Общее время</th>
                            <th className="average-time__table-header">Сессий</th>
                        </tr>
                    </thead>
                    <tbody className="average-time__table-body">
                        {(expanded ? metrics : metrics.slice(0, 10)).map((metric) => (
                            <tr className="average-time__table-row" key={metric.day}>
                                <td className="average-time__table-cell">{format(new Date(metric.day), "dd.MM.yyyy")}</td>
                                <td className="average-time__table-cell">{formatTime(metric.avg_session_time)}</td>
                                <td className="average-time__table-cell">{formatTime(metric.max_session_time)}</td>
                                <td className="average-time__table-cell">{formatTime(metric.total_site_time)}</td>
                                <td className="average-time__table-cell">{metric.total_sessions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {metrics.length > 10 && (
                    <button className="average-time__expand-button" onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Свернуть" : "Развернуть"}
                    </button>
                )}
            </div>
        </section>
    );
};

export default AverageTimeComponent;