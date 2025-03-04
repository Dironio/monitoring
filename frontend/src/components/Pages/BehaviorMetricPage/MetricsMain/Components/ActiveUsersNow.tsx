import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface ActiveUsersData {
    current_active_users: number;
    yesterday_active_users: number;
}

interface DailyActiveUsersData {
    date: string;
    daily_active_users: number;
}

const ActiveUsersNow: React.FC = () => {
    const [activeUsersData, setActiveUsersData] = useState<ActiveUsersData | null>(null);
    const [dailyActiveUsersData, setDailyActiveUsersData] = useState<DailyActiveUsersData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<'month' | 'week'>('week');

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const activeUsersResponse = await getAPI.get<ActiveUsersData>(`/events/behavior/metrics/active-users?web_id=${selectedSite.value}`);
                setActiveUsersData(activeUsersResponse.data);

                const dailyActiveUsersResponse = await getAPI.get<DailyActiveUsersData[]>(`/events/behavior/metrics/daily-active-users?web_id=${selectedSite.value}&interval=${interval}`);
                setDailyActiveUsersData(dailyActiveUsersResponse.data);
                console.log('активные пользователи', activeUsersResponse)
                console.log('актив в течении месяца/недели', dailyActiveUsersResponse)
            } catch (error) {
                console.error('Error fetching active users data:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchActiveUsers();
    }, [interval]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <div className="active-user-card">
            <h2 className="active-user-card__title">Активные пользователи</h2>
            {loading ? (
                <p className="active-user-card__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="active-user-card__error">{error}</p>
            ) : (
                <>
                    <div className="active-user-card__stats">
                        <div className="active-user-card__stat active-user-card__stat--current">
                            <p className="active-user-card__stat-label">Сейчас</p>
                            <p className="active-user-card__stat-value">
                                {activeUsersData?.current_active_users || 0}
                            </p>
                        </div>
                        <div className="active-user-card__stat active-user-card__stat--yesterday">
                            <p className="active-user-card__stat-label">Вчера в это время</p>
                            <p className="active-user-card__stat-value">
                                {activeUsersData?.yesterday_active_users || 0}
                            </p>
                        </div>
                    </div>

                    <div className="active-user-card__interval-buttons">
                        <button
                            onClick={() => setInterval('week')}
                            className={`active-user-card__interval-button ${interval === 'week' ? 'active-user-card__interval-button--active' : ''}`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={() => setInterval('month')}
                            className={`active-user-card__interval-button ${interval === 'month' ? 'active-user-card__interval-button--active' : ''}`}
                        >
                            Месяц
                        </button>
                    </div>

                    <div className="active-user-card__chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dailyActiveUsersData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={formatDate} angle={0} textAnchor="end" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="daily_active_users"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    name="Активные пользователи"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default ActiveUsersNow;
