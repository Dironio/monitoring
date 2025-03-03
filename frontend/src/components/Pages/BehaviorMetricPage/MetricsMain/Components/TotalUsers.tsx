import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import { getAPI } from '../../../../utils/axiosGet';

// Регистрируем компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface TotalUsersData {
    date: string;
    total_users: number;
    daily_users: number;
}

const TotalUsers: React.FC = () => {
    const [totalUsersData, setTotalUsersData] = useState<TotalUsersData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const response = await getAPI.get<TotalUsersData[]>(`/events/behavior/metrics/total-users?web_id=${selectedSite.value}`);
                setTotalUsersData(response.data);
            } catch (error) {
                console.error('Error fetching total users data:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchTotalUsers();
    }, []);

    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU'); // Формат: ДД.ММ.ГГГГ
    };

    // Данные для графика
    const data = {
        labels: Array.isArray(totalUsersData) ? totalUsersData.map((item) => formatDate(item.date)) : [],
        datasets: [
            {
                label: 'Общее количество пользователей',
                data: Array.isArray(totalUsersData) ? totalUsersData.map((item) => item.total_users) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Новые пользователи за день',
                data: Array.isArray(totalUsersData) ? totalUsersData.map((item) => item.daily_users) : [],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
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
                text: 'Общее количество пользователей и новые пользователи за день',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="metric-card">
            <h2>Общее количество пользователей</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>
                        Общее количество пользователей: <strong>{totalUsersData.length > 0 ? totalUsersData[totalUsersData.length - 1].total_users : 0}</strong>
                    </p>
                    <Bar data={data} options={options} />
                </>
            )}
        </div>
    );
};

export default TotalUsers;
