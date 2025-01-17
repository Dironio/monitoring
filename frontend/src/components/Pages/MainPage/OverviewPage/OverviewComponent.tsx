import "./OverviewComponent.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { User } from "../../../../models/user.model";
import { TrendDescription } from "./TrandDescription";
import { useOverviewMetrics } from "../../hooks/useOverviewMetrics";

interface OverviewProps {
    user: User | null;
    loading: boolean;
}

interface MetricData {
    day: string;
    value: number;
    fill: string;
}

const OverviewComponent: React.FC<OverviewProps> = ({ user, loading }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const {
        dailyActiveUsers,
        averageSessionTime,
        topPages,
        trends,
        error,
        formatDuration
    } = useOverviewMetrics();

    const displayedPages = isExpanded ? topPages : topPages.slice(0, 10);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const hasValidData = (data: any[]) => {
        return Array.isArray(data) && data.length > 0 && data.every(item =>
            item.day && (typeof item.value === 'number' || item.value === 0)
        );
    };

    useEffect(() => {
        if (dailyActiveUsers.length > 0) {
            setIsInitialLoad(false);
        }
    }, [dailyActiveUsers]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <section className="overview-container">
            <div className="card">
                <h2 className="card-title">Ежедневные активные пользователи</h2>
                <div className="chart-wrapper">
                    {(loading || isInitialLoad) ? (
                        <div className="no-data-message">
                            Загрузка данных...
                        </div>
                    ) : hasValidData(dailyActiveUsers) ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={dailyActiveUsers}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="day"
                                    tickFormatter={formatDate}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis
                                    allowDecimals={false}
                                    domain={[0, 'auto']}
                                />
                                <Tooltip
                                    labelFormatter={formatDate}
                                    formatter={(value: number) => [value, "Пользователей"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#7553FF"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-message">
                            {loading ? "Загрузка данных..." : "Нет данных для отображения"}
                        </div>
                    )}
                </div>
                {hasValidData(dailyActiveUsers) && (
                    <TrendDescription
                        trend={trends.users}
                        metric="users"
                        currentValue={dailyActiveUsers[dailyActiveUsers.length - 1]?.value || 0}
                    />
                )}
            </div>

            <div className="card">
                <h2 className="card-title">Среднее время на сайте</h2>
                <div className="chart-wrapper">
                    {hasValidData(averageSessionTime) ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={averageSessionTime}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="day"
                                    tickFormatter={formatDate}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis
                                    tickFormatter={formatDuration}
                                    domain={[0, 'auto']}
                                />
                                <Tooltip
                                    labelFormatter={formatDate}
                                    formatter={(value: number) => [formatDuration(value), "Время"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#FF8042"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-message">
                            {loading ? "Загрузка данных..." : "Нет данных для отображения"}
                        </div>
                    )}
                </div>
                {hasValidData(averageSessionTime) && (
                    <TrendDescription
                        trend={trends.time}
                        metric="time"
                        currentValue={formatDuration(averageSessionTime[averageSessionTime.length - 1]?.value || 0)}
                    />
                )}
            </div>

            <div className="card">
                <h2 className="card-title">Популярные страницы</h2>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="table-header">URL Страницы</th>
                                <th className="table-header">Посещения</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedPages.map((page, index) => (
                                <tr key={index}>
                                    <td className="table-cell">
                                        {page.page_url.replace('http://localhost:3000', '')}
                                    </td>
                                    <td className="table-cell">{page.visits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {topPages.length > 10 && (
                    <button
                        className="expand-button"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Скрыть' : 'Показать больше'}
                    </button>
                )}
            </div>
        </section>
    );
};

export default OverviewComponent;
