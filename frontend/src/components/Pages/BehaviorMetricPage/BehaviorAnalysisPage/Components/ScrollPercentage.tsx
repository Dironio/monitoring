import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface ScrollData {
    date: string;
    average_scroll_percentage: number;
}

const ScrollPercentage: React.FC = () => {
    const [scrollData, setScrollData] = useState<ScrollData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<'month' | 'week'>('week');

    useEffect(() => {
        const fetchScrollData = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const response = await getAPI.get<ScrollData[]>(`/events/behavior/behavior/scroll-percentage?web_id=${selectedSite.value}&interval=${interval}`);
                setScrollData(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchScrollData();
    }, [interval]);

    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU'); // Формат: ДД.ММ.ГГГГ
    };

    // Форматирование процента прокрутки
    const formatScrollPercentage = (percentage: number): string => {
        return `${Math.round(percentage)}%`;
    };

    // Расчет тенденции
    const calculateTrend = (data: ScrollData[]): string => {
        if (data.length < 2) return 'Недостаточно данных';

        const last = data[data.length - 1].average_scroll_percentage;
        const prev = data[data.length - 2].average_scroll_percentage;

        return last > prev ? 'Увеличивается' : 'Снижается';
    };

    return (
        <div className="metric-card">
            <h2 className="metric-card__title">Процент прокрутки</h2>
            {loading ? (
                <p className="metric-card__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="metric-card__error">{error}</p>
            ) : (
                <>
                    <div className="metric-card__stats">
                        <div className="metric-card__stat metric-card__stat--current">
                            <p className="metric-card__stat-label">Средний процент прокрутки</p>
                            <p className="metric-card__stat-value">
                                {scrollData.length > 0 ? formatScrollPercentage(scrollData[scrollData.length - 1].average_scroll_percentage) : 'Нет данных'}
                            </p>
                        </div>
                        <div className="metric-card__stat metric-card__stat--trend">
                            <p className="metric-card__stat-label">Тенденция</p>
                            <p className="metric-card__stat-value">
                                {calculateTrend(scrollData)}
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
                                data={scrollData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={formatDate} angle={-45} textAnchor="end" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="average_scroll_percentage"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    name="Средний процент прокрутки"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default ScrollPercentage;