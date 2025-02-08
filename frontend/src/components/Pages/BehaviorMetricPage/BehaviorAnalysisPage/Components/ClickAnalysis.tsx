import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

interface ClickData {
    element: string;
    clickCount: number;
}

const ClickAnalysis: React.FC = () => {
    const [clickData, setClickData] = useState<ClickData[]>([]);

    useEffect(() => {
        fetchClickData();
    }, []);

    const fetchClickData = async () => {
        try {
            const response = await axios.get<ClickData[]>('/events/clicks');
            setClickData(response.data);
        } catch (error) {
            console.error('Error fetching click data:', error);
        }
    };

    const data = {
        labels: clickData.map((item) => item.element),
        datasets: [
            {
                label: 'Количество кликов',
                data: clickData.map((item) => item.clickCount),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
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
            <h2>Анализ кликов</h2>
            <p>
                Самый популярный элемент: {clickData.length > 0 ? clickData[0].element : 'Загрузка данных...'}
            </p>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ClickAnalysis;