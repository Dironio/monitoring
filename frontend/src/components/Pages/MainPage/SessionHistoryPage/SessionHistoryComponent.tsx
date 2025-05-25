// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     BarChart,
//     Bar
// } from "recharts";
// import "./SessionHistoryComponent.css";
// import { User } from '../../../../models/user.model';

// // Определение типов
// interface SessionSummary {
//     session_id: string;
//     session_start: string;
//     total_duration: number;
//     pages_visited: number;
//     events_count: number;
//     traffic_source: string | null;
// }

// interface PageAnalytics {
//     page_url: string;
//     views: number;
//     avg_interaction_time: number;
// }

// interface InteractionAnalytics {
//     element_type: string;
//     interactions_count: number;
//     avg_duration: number;
// }

// interface TimeInterval {
//     time_range: string;
//     count: number;
// }

// interface HistoryProps {
//     user: User | null;
//     loading: boolean;
// }

// const HistoryComponent: React.FC<HistoryProps> = ({ user, loading }) => {
//     const [sessionHistory, setSessionHistory] = useState<SessionSummary[]>([
//         {
//             session_id: '1',
//             session_start: '2025-01-15T10:00:00',
//             total_duration: 300,
//             pages_visited: 5,
//             events_count: 15,
//             traffic_source: 'direct'
//         },
//         {
//             session_id: '2',
//             session_start: '2025-01-15T11:00:00',
//             total_duration: 600,
//             pages_visited: 8,
//             events_count: 25,
//             traffic_source: 'google'
//         },
//     ]);

//     const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([
//         {
//             page_url: '/home',
//             views: 100,
//             avg_interaction_time: 45
//         },
//         {
//             page_url: '/products',
//             views: 75,
//             avg_interaction_time: 60
//         },
//     ]);

//     const [interactionTypes, setInteractionTypes] = useState<InteractionAnalytics[]>([
//         {
//             element_type: 'button',
//             interactions_count: 50,
//             avg_duration: 2
//         },
//         {
//             element_type: 'form',
//             interactions_count: 30,
//             avg_duration: 45
//         },
//     ]);

//     const [timeIntervals, setTimeIntervals] = useState<TimeInterval[]>([
//         {
//             time_range: '0-30 сек',
//             count: 100
//         },
//         {
//             time_range: '30-60 сек',
//             count: 75
//         },
//     ]);

//     const [isExpanded, setIsExpanded] = useState(false);

//     const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('ru-RU', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const formatDuration = (seconds: number) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = Math.floor(seconds % 60);
//         return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!selectedSite) {
//                 console.error("Сайт не выбран");
//                 return;
//             }

//             /*
//             try {
//                 const [historyResponse, analyticsResponse, interactionsResponse, intervalsResponse] = await Promise.all([
//                     axios.get<SessionSummary[]>(`${process.env.REACT_APP_API_URL}/events/history/sessions?web_id=${selectedSite.value}`),
//                     axios.get<PageAnalytics[]>(`${process.env.REACT_APP_API_URL}/events/history/pages?web_id=${selectedSite.value}`),
//                     axios.get<InteractionAnalytics[]>(`${process.env.REACT_APP_API_URL}/events/history/interactions?web_id=${selectedSite.value}`),
//                     axios.get<TimeInterval[]>(`${process.env.REACT_APP_API_URL}/events/history/intervals?web_id=${selectedSite.value}`)
//                 ]);

//                 setSessionHistory(historyResponse.data);
//                 setPageAnalytics(analyticsResponse.data);
//                 setInteractionTypes(interactionsResponse.data);
//                 setTimeIntervals(intervalsResponse.data);
//             } catch (error) {
//                 console.error("Ошибка при получении данных:", error);
//             }
//             */
//         };

//         fetchData();
//     }, [selectedSite]);

//     const displayedSessions = isExpanded ? sessionHistory : sessionHistory.slice(0, 10);

//     return (
//         <section className="history-container">
//             <div className="card">
//                 <h2 className="card-title">История сеансов</h2>
//                 <div className="table-container">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th className="table-header">Начало сеанса</th>
//                                 <th className="table-header">Длительность</th>
//                                 <th className="table-header">Просмотрено страниц</th>
//                                 <th className="table-header">Действий</th>
//                                 <th className="table-header">Источник</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {displayedSessions.map((session, index) => (
//                                 <tr key={index}>
//                                     <td className="table-cell">{formatDate(session.session_start)}</td>
//                                     <td className="table-cell">{formatDuration(session.total_duration)}</td>
//                                     <td className="table-cell">{session.pages_visited}</td>
//                                     <td className="table-cell">{session.events_count}</td>
//                                     <td className="table-cell">{session.traffic_source || 'Прямой заход'}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 {sessionHistory.length > 10 && (
//                     <button
//                         className="expand-button"
//                         onClick={() => setIsExpanded(!isExpanded)}
//                     >
//                         {isExpanded ? 'Скрыть' : 'Показать больше'}
//                     </button>
//                 )}
//             </div>

//             <div className="card">
//                 <h2 className="card-title">Активность по страницам</h2>
//                 <div className="chart-wrapper">
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart
//                             data={pageAnalytics}
//                             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis
//                                 dataKey="page_url"
//                                 tick={false}
//                             />
//                             <YAxis />
//                             <Tooltip
//                                 formatter={(value: number, name: string) => [
//                                     value,
//                                     name === 'views' ? 'Просмотров' : 'Среднее время'
//                                 ]}
//                             />
//                             <Bar dataKey="views" fill="#7553FF" name="Просмотров" />
//                             <Bar dataKey="avg_interaction_time" fill="#FF8042" name="Среднее время" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             <div className="card">
//                 <h2 className="card-title">Типы взаимодействий</h2>
//                 <div className="table-container">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th className="table-header">Тип элемента</th>
//                                 <th className="table-header">Количество взаимодействий</th>
//                                 <th className="table-header">Среднее время (сек)</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {interactionTypes.map((type, index) => (
//                                 <tr key={index}>
//                                     <td className="table-cell">{type.element_type}</td>
//                                     <td className="table-cell">{type.interactions_count}</td>
//                                     <td className="table-cell">
//                                         {formatDuration(type.avg_duration)}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             <div className="card">
//                 <h2 className="card-title">Интервалы между действиями</h2>
//                 <div className="chart-wrapper">
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart
//                             data={timeIntervals}
//                             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="time_range" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey="count" fill="#7553FF" name="Количество" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HistoryComponent;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    XAxisProps,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import { User } from '../../../../models/user.model';
import {
    mockSessionHistory,
    mockPageAnalytics,
    mockInteractionAnalytics,
    mockTimeIntervals,
    SessionSummary,
    PageAnalytics,
    InteractionAnalytics,
    TimeInterval
} from './mockData';
import './SessionHistoryComponent.css';

// Определение типов
interface HistoryProps {
    user: User | null;
    loading: boolean;
}

const HistoryComponent: React.FC<HistoryProps> = ({ user, loading }) => {
    const [sessionHistory, setSessionHistory] = useState<SessionSummary[]>(mockSessionHistory);
    const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>(mockPageAnalytics);
    const [interactionTypes, setInteractionTypes] = useState<InteractionAnalytics[]>(mockInteractionAnalytics);
    const [timeIntervals, setTimeIntervals] = useState<TimeInterval[]>(mockTimeIntervals);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleRowClick = (session: SessionSummary) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSite) {
                console.error("Сайт не выбран");
                return;
            }

            // Реальный API-запрос закомментирован, используются mock-данные
            /*
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
            */
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
                                <tr
                                    key={index}
                                    className="table-row"
                                    onClick={() => handleRowClick(session)}
                                    style={{ cursor: 'pointer' }}
                                >
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

            {isModalOpen && selectedSession && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Детали сессии {selectedSession.session_id}</h2>
                        <button className="modal-close-button" onClick={closeModal}>
                            ×
                        </button>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="table-header">ID события</th>
                                    <th className="table-header">URL страницы</th>
                                    <th className="table-header">Время</th>
                                    <th className="table-header">Источник</th>
                                    <th className="table-header">Геолокация</th>
                                    <th className="table-header">User Agent</th>
                                    <th className="table-header">Данные события</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSession.details.map((detail, index) => (
                                    <tr key={index}>
                                        <td className="table-cell">{detail.id}</td>
                                        <td className="table-cell">{detail.page_url}</td>
                                        <td className="table-cell">{formatDate(detail.timestamp)}</td>
                                        <td className="table-cell">{detail.referrer || 'Нет'}</td>
                                        <td className="table-cell">
                                            {detail.geolocation
                                                ? `${detail.geolocation.city}, ${detail.geolocation.country}`
                                                : 'Нет данных'}
                                        </td>
                                        <td className="table-cell">
                                            {detail.user_agent
                                                ? `${detail.user_agent.browser} (${detail.user_agent.os})`
                                                : 'Нет данных'}
                                        </td>
                                        <td className="table-cell">
                                            {JSON.stringify(detail.event_data, null, 2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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