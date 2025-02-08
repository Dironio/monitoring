import { useEffect, useState } from "react";
import { Bar } from "recharts";

const SalesRating: React.FC = () => {
    const [salesData, setSalesData] = useState<SalesData[]>([]);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get<SalesData[]>('/events/sales');
            setSalesData(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const data = {
        labels: salesData.map((item) => item.date),
        datasets: [
            {
                label: 'Продажи',
                data: salesData.map((item) => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="metric-card">
            <h2>Продажи</h2>
            <p>
                Всего продаж за последние 7 дней: {salesData.length > 0 ? salesData[salesData.length - 1].count : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {salesData.length > 1 ? (salesData[salesData.length - 1].count > salesData[salesData.length - 2].count ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            <Bar data={data} options={options} />
        </div>
    );
};

export default SalesRating;