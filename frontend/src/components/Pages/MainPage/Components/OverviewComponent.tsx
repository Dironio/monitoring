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

interface OverviewProps {
    user: User | null;
    loading: boolean;
}

const OverviewComponent: React.FC<OverviewProps> = ({ user, loading }) => {
    const [dailyActiveUsers, setDailyActiveUsers] = useState<{ day: string; active_users: number }[]>([]);
    const [averageSessionTime, setAverageSessionTime] = useState<{ day: string; avg_time: number }[]>([]);
    const [topPages, setTopPages] = useState<{ page_url: string; visits: number }[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const displayedPages = isExpanded ? topPages : topPages.slice(0, 10);

    const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSite) {
                console.error("Сайт не выбран");
                return;
            }

            try {
                const dailyResponse = await axios.get<{ day: string; active_users: number }[]>(
                    `${process.env.REACT_APP_API_URL}/events/main/daily?web_id=${selectedSite.value}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setDailyActiveUsers(dailyResponse.data);

                const avgSessionResponse = await axios.get<{ day: string; avg_time: number }[]>(
                    `${process.env.REACT_APP_API_URL}/events/main/duration?web_id=${selectedSite.value}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setAverageSessionTime(avgSessionResponse.data);

                const topPagesResponse = await axios.get<{ page_url: string; visits: number }[]>(
                    `${process.env.REACT_APP_API_URL}/events/main/top-pages?web_id=${selectedSite.value}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setTopPages(topPagesResponse.data);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };

        fetchData();
    }, [selectedSite]);

    return (
        <section className="overview-container">
            {/* График: Ежедневные активные пользователи */}
            <div className="card">
                <h2 className="card-title">Ежедневные активные пользователи</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyActiveUsers}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="day"
                                tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")} />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(label) => format(new Date(label), "dd.MM.yyyy")}
                            />
                            <Line type="monotone" dataKey="active_users" stroke="#7553FF" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* График: Среднее время на сайте */}
            <div className="card">
                <h2 className="card-title">Среднее время на сайте</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={averageSessionTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="day"
                                tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="avg_time" stroke="#FF8042" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
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
                                    <td className="table-cell">{page.page_url.replace('http://localhost:3000', '')}</td>
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
