import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface FormData {
    form_id: string;
    form_submit_count: number;
}

const FormAnalysis: React.FC = () => {
    const [formData, setFormData] = useState<FormData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interval, setInterval] = useState<'month' | 'week'>('week');

    useEffect(() => {
        const fetchFormData = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const response = await getAPI.get<FormData[]>(`/events/behavior/behavior/form-analysis?web_id=${selectedSite.value}&interval=${interval}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [interval]);

    const getTopForm = (data: FormData[]): string => {
        if (data.length === 0) return 'Нет данных';
        return `Форма ${data[0].form_id} (${data[0].form_submit_count} отправок)`;
    };

    return (
        <div className="metric-card">
            <h2 className="metric-card__title">Анализ форм</h2>
            {loading ? (
                <p className="metric-card__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="metric-card__error">{error}</p>
            ) : (
                <>
                    <div className="metric-card__stats">
                        <div className="metric-card__stat metric-card__stat--current">
                            <p className="metric-card__stat-label">Самая популярная форма</p>
                            <p className="metric-card__stat-value">
                                {getTopForm(formData)}
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
                                data={formData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="form_id" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="form_submit_count"
                                    fill="hsl(var(--chart-1))"
                                    name="Количество отправок"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default FormAnalysis;