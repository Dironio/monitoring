import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { getAPI } from "../../../../utils/axiosGet";
import { useSiteContext } from "../../../../utils/SiteContext";

interface LoadingSpeedData {
    date: string;
    speed: number;
}

const PageLoadingSpeed: React.FC = () => {
    const [loadingSpeedData, setLoadingSpeedData] = useState<LoadingSpeedData[]>([]);
    const [averageSpeed, setAverageSpeed] = useState<number | null>(null);
    const [trend, setTrend] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedSite, setSelectedSite } = useSiteContext();

    useEffect(() => {
        fetchLoadingSpeed();
    }, []);

    const fetchLoadingSpeed = async () => {
        try {
            setLoading(true);
            const response = await getAPI.get<LoadingSpeedData[]>(`/events/behavior/metrics/loading-speed?web_id=${selectedSite?.value}`);
            const data = response.data;

            if (!data || data.length === 0) {
                setError('Нет данных о скорости загрузки.');
                setLoading(false);
                return;
            }

            setLoadingSpeedData(data);

            // Вычисление средней скорости загрузки за период
            const avg = data.reduce((sum, item) => sum + item.speed, 0) / data.length;
            setAverageSpeed(Math.round(avg));

            // Определение тенденции
            if (data.length > 1) {
                const lastSpeed = data[data.length - 1].speed;
                const prevSpeed = data[data.length - 2].speed;
                setTrend(lastSpeed > prevSpeed ? 'Скорость загрузки увеличивается 📈' : 'Скорость загрузки снижается 📉');
            } else {
                setTrend('Недостаточно данных для определения тренда');
            }

            setLoading(false);
        } catch (err) {
            setError('Ошибка загрузки данных.');
            setLoading(false);
        }
    };

    const data = {
        labels: loadingSpeedData.map((item) => item.date),
        datasets: [
            {
                label: 'Скорость загрузки (мс)',
                data: loadingSpeedData.map((item) => item.speed),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Время загрузки (мс)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Дата',
                },
            },
        },
    };

    return (
        <div className="metric-card">
            <h2>📊 Скорость загрузки страницы</h2>

            {loading ? (
                <p className="loading">Загрузка данных...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <div className="metric-info">
                        <p>
                            <strong>Среднее время загрузки:</strong> {averageSpeed} мс
                        </p>
                        <p>
                            <strong>Тенденция:</strong> {trend}
                        </p>
                    </div>

                    <div className="chart-container">
                        <Line data={data} options={options} />
                    </div>
                </>
            )}
        </div>
    );
};

export default PageLoadingSpeed;