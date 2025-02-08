import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

interface ErrorData {
    type: string;
    count: number;
}

const ErrorAnalysis: React.FC = () => {
    const [errorData, setErrorData] = useState<ErrorData[]>([]);

    useEffect(() => {
        fetchErrorData();
    }, []);

    const fetchErrorData = async () => {
        try {
            const response = await axios.get<ErrorData[]>('/events/errors');
            setErrorData(response.data);
        } catch (error) {
            console.error('Error fetching error data:', error);
        }
    };

    const data = {
        labels: errorData.map((item) => item.type),
        datasets: [
            {
                label: 'Количество ошибок',
                data: errorData.map((item) => item.count),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
            <h2>Анализ ошибок</h2>
            <p>
                Самая частая ошибка: {errorData.length > 0 ? errorData[0].type : 'Загрузка данных...'}
            </p>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ErrorAnalysis;