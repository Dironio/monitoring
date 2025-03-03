import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface SalesData {
    date: string;
    sales_count: number;
}

const SalesRating: React.FC = () => {
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const response = await getAPI.get<SalesData[]>(`/events/behavior/metrics/sales?web_id=${selectedSite.value}`);
                console.log("Data from backend:", response.data);
                setSalesData(response.data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const calculateTrend = () => {
        if (salesData.length > 1) {
            const lastDaySales = salesData[salesData.length - 1].sales_count;
            const previousDaySales = salesData[salesData.length - 2].sales_count;
            return {
                trend: lastDaySales > previousDaySales ? "увеличивается" : "снижается",
                color: lastDaySales > previousDaySales ? "green" : "red",
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
            <h2>Продажи</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>
                        Всего продаж за последние 7 дней: <strong>{salesData.length > 0 ? salesData[salesData.length - 1].sales_count : 0}</strong>
                    </p>
                    <p>
                        Тенденция: <span style={{ color: trend.color }}>{trend.trend}</span>
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={salesData}
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
                                dataKey="sales_count"
                                fill="#8884d8"
                                name="Продажи"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default SalesRating;
