import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface ClickData {
    element_tag: string;
    click_count: number;
}

const ClickAnalysis: React.FC = () => {
    const [clickData, setClickData] = useState<ClickData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<'month' | 'week'>('week');

    useEffect(() => {
        const fetchClickData = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const response = await getAPI.get<ClickData[]>(`/events/behavior/behavior/clicks?web_id=${selectedSite.value}&interval=${interval}`);
                setClickData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchClickData();
    }, [interval]);

    const getTopElement = (data: ClickData[]): string => {
        if (data.length === 0) return 'Нет данных';
        return `${data[0].element_tag} (${data[0].click_count} кликов)`;
    };

    return (
        <div className="metric-card">
            <h2 className="metric-card__title">Анализ кликов</h2>
            {loading ? (
                <p className="metric-card__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="metric-card__error">{error}</p>
            ) : (
                <>
                    <div className="metric-card__stats">
                        <div className="metric-card__stat metric-card__stat--current">
                            <p className="metric-card__stat-label">Самый популярный элемент</p>
                            <p className="metric-card__stat-value">
                                {getTopElement(clickData)}
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
                            <BarChart
                                data={clickData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="element_tag" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="click_count"
                                    fill="hsl(var(--chart-1))"
                                    name="Количество кликов"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default ClickAnalysis;