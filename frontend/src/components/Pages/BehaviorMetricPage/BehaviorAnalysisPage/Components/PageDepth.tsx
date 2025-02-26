import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

interface PageDepthData {
    date: string;
    averageDepth: number;
}

interface TotalUsersData {
    total_users: number;
}

const PageDepth: React.FC = () => {
    //     const [pageDepthData, setPageDepthData] = useState<PageDepthData[]>([]);

    //     useEffect(() => {
    //         fetchPageDepthData();
    //     }, []);

    //     const fetchPageDepthData = async () => {
    //         try {
    //             const response = await axios.get<PageDepthData[]>('/events/page-depth');
    //             setPageDepthData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching page depth data:', error);
    //         }
    //     };

    //     const data = {
    //         labels: pageDepthData.map((item) => item.date),
    //         datasets: [
    //             {
    //                 label: 'Средняя глубина просмотра',
    //                 data: pageDepthData.map((item) => item.averageDepth),
    //                 backgroundColor: 'rgba(153, 102, 255, 0.2)',
    //                 borderColor: 'rgba(153, 102, 255, 1)',
    //                 borderWidth: 1,
    //             },
    //         ],
    //     };

    //     const options = {
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //             },
    //         },
    //     };

    //     return (
    //         <div className="metric-card">
    //             <h2>Глубина просмотра</h2>
    //             <p>
    //                 Средняя глубина за последние 7 дней: {pageDepthData.length > 0 ? `${pageDepthData[pageDepthData.length - 1].averageDepth} страниц` : 'Загрузка данных...'}
    //             </p>
    //             <p>
    //                 Тенденция: {pageDepthData.length > 1 ? (pageDepthData[pageDepthData.length - 1].averageDepth > pageDepthData[pageDepthData.length - 2].averageDepth ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
    //             </p>
    //             <Bar data={data} options={options} />
    //         </div>
    //     );
    // };

    const [totalUsers, setTotalUsers] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка данных
    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    setLoading(false);
                    return;
                }

                const response = await axios.get<TotalUsersData>(`/events/total-users?web_id=${selectedSite.value}`);
                setTotalUsers(response.data.total_users);
            } catch (error) {
                console.error('Error fetching total users data:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchTotalUsers();
    }, []);

    return (
        <div className="metric-card">
            <h2>Общее количество пользователей</h2>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>
                    Общее количество пользователей: <strong>{totalUsers}</strong>
                </p>
            )}
        </div>
    );
};

export default PageDepth;