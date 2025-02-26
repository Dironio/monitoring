
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getAPI } from '../../../../utils/axiosGet';

// Регистрируем компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LoadingSpeedData {
    date: string; // Дата
    load_time_ms: number; // Скорость загрузки в мс
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
    // Форматирование даты для отображения
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU'); // Формат: ДД.ММ.ГГГГ
    };

    // Данные для графика
    const data = {
        labels: loadingSpeedData.map((item) => formatDate(item.date)), // Форматированные даты
        datasets: [
            {
                label: 'Скорость загрузки (мс)',
                data: loadingSpeedData.map((item) => item.load_time_ms), // Скорость загрузки
                borderColor: 'rgba(75, 192, 192, 1)', // Цвет линии
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Цвет заливки
                fill: true,
            },
        ],
    };

    // Настройки графика
    const options = {
        responsive: true,
        plugins: {

            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Скорость загрузки страницы',
            },
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

    // Расчет средней скорости загрузки
    const averageSpeed =
        loadingSpeedData.reduce((sum, item) => sum + item.load_time_ms, 0) / loadingSpeedData.length || 0;

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
