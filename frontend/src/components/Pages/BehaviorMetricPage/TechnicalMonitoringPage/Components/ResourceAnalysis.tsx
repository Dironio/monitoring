import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

interface ResourceData {
    type: string;
    size: number;
}

const ResourceAnalysis: React.FC = () => {
    const [resourceData, setResourceData] = useState<ResourceData[]>([]);

    useEffect(() => {
        fetchResourceData();
    }, []);

    const fetchResourceData = async () => {
        try {
            const response = await axios.get<ResourceData[]>('/events/resources');
            setResourceData(response.data);
        } catch (error) {
            console.error('Error fetching resource data:', error);
        }
    };

    const data = {
        labels: resourceData.map((item) => item.type),
        datasets: [
            {
                label: 'Размер ресурсов (КБ)',
                data: resourceData.map((item) => item.size),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
            <h2>Анализ ресурсов</h2>
            <p>
                Самый большой ресурс: {resourceData.length > 0 ? resourceData[0].type : 'Загрузка данных...'}
            </p>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ResourceAnalysis;