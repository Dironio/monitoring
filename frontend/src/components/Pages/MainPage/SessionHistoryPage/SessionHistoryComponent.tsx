import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import axios from 'axios';
import "./HistoryComponent.css";
import { User } from '../../../../models/user.model';

interface HistoryProps {
    user: User | null;
    loading: boolean;
}

const HistoryComponent: React.FC<HistoryProps> = ({ user, loading }) => {
    const [sessionHistory, setSessionHistory] = useState<SessionSummary[]>([]);
    const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
    const [interactionTypes, setInteractionTypes] = useState<InteractionAnalytics[]>([]);
    const [timeIntervals, setTimeIntervals] = useState<TimeInterval[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSite) {
                console.error("Сайт не выбран");
                return;
            }

            try {
                const [historyResponse, analyticsResponse, interactionsResponse, intervalsResponse] = await Promise.all([
                    axios.get<SessionSummary[]>(`${process.env.REACT_APP_API_URL}/events/history/sessions?web_id=${selectedSite.value}`),
                    axios.get<PageAnalytics[]>(`${process.env.REACT_APP_API_URL}/events/history/pages?web_id=${selectedSite.value}`),
                    axios.get<InteractionAnalytics[]>(`${process.env.REACT_APP_API_URL}/events/history/interactions?web_id=${selectedSite.value}`),
                    axios.get<TimeInterval[]>(`${process.env.REACT_APP_API_URL}/events/history/intervals?web_id=${selectedSite.value}`)
                ]);

                setSessionHistory(historyResponse.data);
                setPageAnalytics(analyticsResponse.data);
                setInteractionTypes(interactionsResponse.data);
                setTimeIntervals(intervalsResponse.data);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };

        fetchData();
    }, [selectedSite]);

    const displayedSessions = isExpanded ? sessionHistory : sessionHistory.slice(0, 10);

    return (
        <section className="history-container">
            <div className="card">
                <h2 className="card-title">История сеансов</h2>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="table-header">Начало сеанса</th>
                                <th className="table-header">Длительность</th>
                                <th className="table-header">Просмотрено страниц</th>
                                <th className="table-header">Действий</th>
                                <th className="table-header">Источник</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedSessions.map((session, index) => (
                                <tr key={index}>
                                    <td className="table-cell">{formatDate(session.session_start)}</td>
                                    <td className="table-cell">{formatDuration(session.total_duration)}</td>
                                    <td className="table-cell">{session.pages_visited}</td>
                                    <td className="table-cell">{session.events_count}</td>
                                    <td className="table-cell">{session.traffic_source || 'Прямой заход'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sessionHistory.length > 10 && (
                    <button
                        className="expand-button"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Скрыть' : 'Показать больше'}
                    </button>
                )}
            </div>

            <div className="card">
                <h2 className="card-title">Активность по страницам</h2>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={pageAnalytics}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="page_url"
                                tick={false}
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value: number, name: string) => [
                                    value,
                                    name === 'views' ? 'Просмотров' : 'Среднее время'
                                ]}
                            />
                            <Bar dataKey="views" fill="#7553FF" name="Просмотров" />
                            <Bar dataKey="avg_interaction_time" fill="#FF8042" name="Среднее время" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Типы взаимодействий</h2>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="table-header">Тип элемента</th>
                                <th className="table-header">Количество взаимодействий</th>
                                <th className="table-header">Среднее время (сек)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interactionTypes.map((type, index) => (
                                <tr key={index}>
                                    <td className="table-cell">{type.element_type}</td>
                                    <td className="table-cell">{type.interactions_count}</td>
                                    <td className="table-cell">
                                        {formatDuration(type.avg_duration)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Интервалы между действиями</h2>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={timeIntervals}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time_range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#7553FF" name="Количество" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default HistoryComponent;
