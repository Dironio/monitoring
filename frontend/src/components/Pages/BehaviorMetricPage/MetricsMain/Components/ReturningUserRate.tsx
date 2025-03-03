import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { getAPI } from "../../../../utils/axiosGet";

interface ReturningRateData {
    date: string;
    returning_rate: number;
}

const ReturningUserRate: React.FC = () => {
    const [returningRateData, setReturningRateData] = useState<ReturningRateData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReturningRate = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const response = await getAPI.get<ReturningRateData[]>(`/events/behavior/metrics/returning-users?web_id=${selectedSite.value}`);
                setReturningRateData(response.data);
            } catch (error) {
                console.error('Error fetching returning rate:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchReturningRate();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const calculateTrend = () => {
        if (returningRateData.length > 1) {
            const lastDayRate = returningRateData[returningRateData.length - 1].returning_rate;
            const previousDayRate = returningRateData[returningRateData.length - 2].returning_rate;
            return lastDayRate > previousDayRate ? "увеличивается" : "снижается";
        }
        return "недостаточно данных";
    };

    return (
        <div className="metric-card">
            <h2>Коэффициент вернувшихся пользователей</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>
                        Текущий коэффициент: <strong>
                            {returningRateData.length > 0 ? `${returningRateData[returningRateData.length - 1].returning_rate}%` : "нет данных"}
                        </strong>
                    </p>
                    <p>
                        Тенденция: <strong>{calculateTrend()}</strong>
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={returningRateData}
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
                                dataKey="returning_rate"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                name="Коэффициент вернувшихся пользователей (%)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default ReturningUserRate;