import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface EventData {
    event_id: number;
    event_count: number;
}

const EventAnalysis: React.FC = () => {
    const [eventData, setEventData] = useState<EventData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<'month' | 'week'>('week');

    useEffect(() => {
        const fetchEventData = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const response = await getAPI.get<EventData[]>(`/events/behavior/behavior/events?web_id=${selectedSite.value}&interval=${interval}`);
                setEventData(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [interval]);

    // Преобразуем event_id в читаемые названия событий
    const eventMapping: { [key: number]: string } = {
        1: 'Просмотр страницы',
        2: 'Клик',
        3: 'Прокрутка',
        4: 'Фокус на поле',
        5: 'Загрузка формы',
    };

    const formatEventName = (eventId: number): string => {
        return eventMapping[eventId] || `Событие ${eventId}`;
    };

    const getTopEvent = (data: EventData[]): string => {
        if (data.length === 0) return 'Нет данных';
        return `${formatEventName(data[0].event_id)} (${data[0].event_count} раз)`;
    };

    return (
        <div className="metric-card">
            <h2 className="metric-card__title">Анализ событий</h2>
            {loading ? (
                <p className="metric-card__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="metric-card__error">{error}</p>
            ) : (
                <>
                    <div className="metric-card__stats">
                        <div className="metric-card__stat metric-card__stat--current">
                            <p className="metric-card__stat-label">Самое частое событие</p>
                            <p className="metric-card__stat-value">
                                {getTopEvent(eventData)}
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
                                data={eventData.map(item => ({
                                    ...item,
                                    event_name: formatEventName(item.event_id),
                                }))}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="event_name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="event_count"
                                    fill="hsl(var(--chart-1))"
                                    name="Количество событий"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default EventAnalysis;