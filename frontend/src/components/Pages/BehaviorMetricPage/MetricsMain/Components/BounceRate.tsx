import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface BounceRateData {
    date: string;
    bounce_rate: number;
}

const BounceRate: React.FC = () => {
    const [bounceRateData, setBounceRateData] = useState<BounceRateData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBounceRate = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const response = await getAPI.get<BounceRateData[]>(`/events/behavior/metrics/bounce-rate?web_id=${selectedSite.value}`);
                setBounceRateData(response.data);
            } catch (error) {
                console.error('Error fetching bounce rate:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchBounceRate();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const calculateTrend = () => {
        if (bounceRateData.length > 1) {
            const lastDayRate = bounceRateData[bounceRateData.length - 1].bounce_rate;
            const previousDayRate = bounceRateData[bounceRateData.length - 2].bounce_rate;
            return lastDayRate > previousDayRate ? "увеличивается" : "снижается";
        }
        return "недостаточно данных";
    };

    return (
        <div className="metric-card">
            <h2>Показатель отказов</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>
                        Текущий показатель: <strong>
                            {bounceRateData.length > 0 ? `${bounceRateData[bounceRateData.length - 1].bounce_rate}%` : "нет данных"}
                        </strong>
                    </p>
                    <p>
                        Тенденция: <strong>{calculateTrend()}</strong>
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={bounceRateData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={formatDate} angle={0} textAnchor="end" />
                            <YAxis domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="bounce_rate"
                                stroke="#ff6384"
                                activeDot={{ r: 8 }}
                                name="Показатель отказов (%)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default BounceRate;
