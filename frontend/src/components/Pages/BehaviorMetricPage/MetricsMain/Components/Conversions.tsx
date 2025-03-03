import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface ConversionsData {
    date: string;
    conversions_count: number;
}

const ConversionsMetric: React.FC = () => {
    const [conversionsData, setConversionsData] = useState<ConversionsData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversions = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const response = await getAPI.get<ConversionsData[]>(`/events/behavior/metrics/conversions?web_id=${selectedSite.value}`);
                console.log("Data from backend:", response.data);
                setConversionsData(response.data);
            } catch (error) {
                console.error('Error fetching conversions data:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchConversions();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const calculateTrend = () => {
        if (conversionsData.length > 1) {
            const lastDayConversions = conversionsData[conversionsData.length - 1].conversions_count;
            const previousDayConversions = conversionsData[conversionsData.length - 2].conversions_count;
            return {
                trend: lastDayConversions > previousDayConversions ? "увеличивается" : "снижается",
                color: lastDayConversions > previousDayConversions ? "green" : "red",
            };
        }
        return {
            trend: "недостаточно данных",
            color: "gray",
        };
    };

    const trend = calculateTrend();

    return (
        <div className="metric-card">
            <h2>Конверсии</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>
                        Всего конверсий за последние 7 дней: <strong>{conversionsData.length > 0 ? conversionsData[conversionsData.length - 1].conversions_count : 0}</strong>
                    </p>
                    <p>
                        Тенденция: <span style={{ color: trend.color }}>{trend.trend}</span>
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={conversionsData}
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
                            <Bar
                                dataKey="conversions_count"
                                fill="#8884d8"
                                name="Конверсии"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default ConversionsMetric;