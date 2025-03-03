import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Добавлен ResponsiveContainer
import { getAPI } from "../../../../utils/axiosGet";

interface TotalMetricsData {
    date: string;
    total_users: number;
    total_visits: number;
    daily_users: number;
    daily_visits: number;
}

const TotalVisits: React.FC = () => {
    const [totalMetricsData, setTotalMetricsData] = useState<TotalMetricsData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTotalMetrics = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const response = await getAPI.get<TotalMetricsData[]>(`/events/behavior/metrics/total-sessions?web_id=${selectedSite.value}`);
                setTotalMetricsData(response.data);
            } catch (error) {
                console.error('Error fetching total metrics:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchTotalMetrics();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const maxValue = Math.max(
        ...totalMetricsData.map((item) => Math.max(item.total_users, item.total_visits))
    );

    const roundToNextMultiple = (value: number, multiple: number) => {
        return Math.ceil(value / multiple) * multiple;
    };

    const roundedMaxValue = roundToNextMultiple(maxValue, 50);

    return (
        <div className="metric-card">
            <h2>Метрики пользователей и визитов</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>
                        Всего уникальных пользователей за все время: <strong>{totalMetricsData.length > 0 ? totalMetricsData[totalMetricsData.length - 1].total_users : 0}</strong>
                    </p>
                    <p>
                        Всего визитов за все время: <strong>{totalMetricsData.length > 0 ? totalMetricsData[totalMetricsData.length - 1].total_visits : 0}</strong>
                    </p>
                    <p>
                        Новые пользователи за последний день: <strong>{totalMetricsData.length > 0 ? totalMetricsData[totalMetricsData.length - 1].daily_users : 0}</strong>
                    </p>
                    <p>
                        Новые визиты за последний день: <strong>{totalMetricsData.length > 0 ? totalMetricsData[totalMetricsData.length - 1].daily_visits : 0}</strong>
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={totalMetricsData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={formatDate} angle={0} textAnchor="end" />
                            <YAxis
                                domain={[0, roundedMaxValue]}
                                ticks={Array.from({ length: roundedMaxValue / 50 + 1 }, (_, i) => i * 50)}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, roundedMaxValue]}
                                ticks={Array.from({ length: roundedMaxValue / 50 + 1 }, (_, i) => i * 50)}
                            />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="total_users"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                name="Уникальные пользователи"
                            />
                            <Line
                                type="monotone"
                                dataKey="total_visits"
                                stroke="#82ca9d"
                                name="Визиты"
                                yAxisId="right"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default TotalVisits;