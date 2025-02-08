import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

interface PageDepthData {
    date: string;
    averageDepth: number;
}

const PageDepth: React.FC = () => {
    const [pageDepthData, setPageDepthData] = useState<PageDepthData[]>([]);

    useEffect(() => {
        fetchPageDepthData();
    }, []);

    const fetchPageDepthData = async () => {
        try {
            const response = await axios.get<PageDepthData[]>('/events/page-depth');
            setPageDepthData(response.data);
        } catch (error) {
            console.error('Error fetching page depth data:', error);
        }
    };

    const data = {
        labels: pageDepthData.map((item) => item.date),
        datasets: [
            {
                label: 'Средняя глубина просмотра',
                data: pageDepthData.map((item) => item.averageDepth),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
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
            <h2>Глубина просмотра</h2>
            <p>
                Средняя глубина за последние 7 дней: {pageDepthData.length > 0 ? `${pageDepthData[pageDepthData.length - 1].averageDepth} страниц` : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {pageDepthData.length > 1 ? (pageDepthData[pageDepthData.length - 1].averageDepth > pageDepthData[pageDepthData.length - 2].averageDepth ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            <Bar data={data} options={options} />
        </div>
    );
};

export default PageDepth;