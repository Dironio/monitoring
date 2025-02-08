import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

interface PerformanceData {
    date: string;
    loadTime: number;
    ttfb: number;
    pageSize: number;
}

const PerformanceMetrics: React.FC = () => {
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

    useEffect(() => {
        fetchPerformanceData();
    }, []);

    const fetchPerformanceData = async () => {
        try {
            const response = await axios.get<PerformanceData[]>('/events/performance');
            setPerformanceData(response.data);
        } catch (error) {
            console.error('Error fetching performance data:', error);
        }
    };

    const data = {
        labels: performanceData.map((item) => item.date),
        datasets: [
            {
                label: 'Время загрузки (мс)',
                data: performanceData.map((item) => item.loadTime),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: 'TTFB (мс)',
                data: performanceData.map((item) => item.ttfb),
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
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
            <h2>Производительность сайта</h2>
            <p>
                Среднее время загрузки: {performanceData.length > 0 ? `${performanceData[performanceData.length - 1].loadTime} мс` : 'Загрузка данных...'}
            </p>
            <p>
                Средний TTFB: {performanceData.length > 0 ? `${performanceData[performanceData.length - 1].ttfb} мс` : 'Загрузка данных...'}
            </p>
            <Line data={data} options={options} />
        </div>
    );
};

export default PerformanceMetrics;