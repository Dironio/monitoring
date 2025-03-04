import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface TimeOnSiteData {
    date: string;
    average_time_on_site: number;
}

const TimeOnSite: React.FC = () => {
    const [timeOnSiteData, setTimeOnSiteData] = useState<TimeOnSiteData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<'month' | 'week'>('week');

    useEffect(() => {
        const fetchTimeOnSiteData = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const response = await getAPI.get<TimeOnSiteData[]>(`/events/behavior/behavior/average-time?web_id=${selectedSite.value}&interval=${interval}`);
                setTimeOnSiteData(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchTimeOnSiteData();
    }, [interval]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const calculateTrend = (data: TimeOnSiteData[]): string => {
        if (data.length < 2) return 'Недостаточно данных';

        const last = data[data.length - 1].average_time_on_site;
        const prev = data[data.length - 2].average_time_on_site;

        return last > prev ? 'Увеличивается' : 'Снижается';
    };

    return (
        <div className="metric-card">
            <h2 className="metric-card__title">Время на сайте</h2>
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
                                {timeOnSiteData.length > 0 ? `${timeOnSiteData[timeOnSiteData.length - 1].average_time_on_site.toFixed(2)} сек` : 'Нет данных'}
                            </p>
                        </div>
                        <div className="metric-card__stat metric-card__stat--trend">
                            <p className="metric-card__stat-label">Тенденция</p>
                            <p className="metric-card__stat-value">
                                {calculateTrend(timeOnSiteData)}
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
                                data={timeOnSiteData}
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
                                    dataKey="average_time_on_site"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    name="Среднее время на сайте (сек)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default TimeOnSite;
