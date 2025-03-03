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
    date: string;
    load_time_ms: number;
}

const PageLoadingSpeed: React.FC = () => {
    const [loadingSpeedData, setLoadingSpeedData] = useState<LoadingSpeedData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLoadingSpeed = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const response = await getAPI.get<LoadingSpeedData[]>(`/events/behavior/metrics/loading-speed?web_id=${selectedSite.value}`);
                if (Array.isArray(response.data)) {
                    setLoadingSpeedData(response.data);
                } else {
                    setError("Данные получены в неверном формате");
                }
            } catch (err) {
                console.error('Error fetching loading speed:', err);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchLoadingSpeed();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const data = {
        labels: loadingSpeedData.map((item) => formatDate(item.date)),
        datasets: [
            {
                label: 'Скорость загрузки (мс)',
                data: loadingSpeedData.map((item) => item.load_time_ms),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

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
                    text: 'Время (мс)',
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

    const averageSpeed =
        loadingSpeedData.reduce((sum, item) => sum + item.load_time_ms, 0) / loadingSpeedData.length || 0;

    return (
        <div className="metric-card">
            <h2>Скорость загрузки страницы</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>
                        Среднее время загрузки страницы за последние {loadingSpeedData.length} дней:{' '}
                        <strong>{Math.round(averageSpeed)} мс</strong> (миллисекунды).
                    </p>
                    <Line data={data} options={options} />
                </>
            )}
        </div>
    );
};

export default PageLoadingSpeed;
