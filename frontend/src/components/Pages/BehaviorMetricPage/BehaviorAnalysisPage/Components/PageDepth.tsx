import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface PageDepthData {
    date: string;
    average_page_depth: number;
}

interface TotalUsersData {
    total_users: number;
}

const PageDepth: React.FC = () => {
    const [totalUsers, setTotalUsers] = useState<number | null>(null);
    const [pageDepthData, setPageDepthData] = useState<PageDepthData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<'month' | 'week'>('week');

    useEffect(() => {
        const fetchData = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const totalUsersResponse = await getAPI.get<TotalUsersData>(`/events/behavior/metrics/total-users?web_id=${selectedSite.value}`);
                setTotalUsers(totalUsersResponse.data.total_users);

                const pageDepthResponse = await getAPI.get<PageDepthData[]>(`/events/behavior/behavior/average-depth?web_id=${selectedSite.value}&interval=${interval}`);
                setPageDepthData(pageDepthResponse.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [interval]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const calculateTrend = (data: PageDepthData[]): string => {
        if (data.length < 2) return 'Недостаточно данных';

        const last = data[data.length - 1]?.average_page_depth;
        const prev = data[data.length - 2]?.average_page_depth;

        if (last === undefined || prev === undefined) {
            return 'Недостаточно данных';
        }

        return last > prev ? 'Увеличивается' : 'Снижается';
    };

    return (
        <div className="metric-card">
            <h2 className="metric-card__title">Глубина просмотра страниц</h2>
            {loading ? (
                <p className="metric-card__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="metric-card__error">{error}</p>
            ) : (
                <>
                    <div className="metric-card__stats">
                        <div className="metric-card__stat metric-card__stat--current">
                            <p className="metric-card__stat-label">Сегодня</p>
                            <p className="metric-card__stat-value">
                                {pageDepthData.length > 0 ? `${pageDepthData[pageDepthData.length - 1].average_page_depth.toFixed(2)} стр.` : 'Нет данных'}
                            </p>
                        </div>
                        <div className="metric-card__stat metric-card__stat--trend">
                            <p className="metric-card__stat-label">Тенденция</p>
                            <p className="metric-card__stat-value">
                                {calculateTrend(pageDepthData)}
                            </p>
                        </div>
                    </div>

                    <div className="metric-card__interval-buttons">
                        <button
                            onClick={() => setInterval('week')}
                            className={`metric-card__interval-button ${interval === 'week' ? 'metric-card__interval-button--active' : ''}`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={() => setInterval('month')}
                            className={`metric-card__interval-button ${interval === 'month' ? 'metric-card__interval-button--active' : ''}`}
                        >
                            Месяц
                        </button>
                    </div>

                    <div className="metric-card__chart">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={pageDepthData}
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
                                    dataKey="average_page_depth"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    name="Средняя глубина (стр.)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default PageDepth;
