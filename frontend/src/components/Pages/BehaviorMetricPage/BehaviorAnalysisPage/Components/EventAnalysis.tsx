import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

interface EventData {
    event: string;
    count: number;
}

const EventAnalysis: React.FC = () => {
    const [eventData, setEventData] = useState<EventData[]>([]);

    useEffect(() => {
        fetchEventData();
    }, []);

    const fetchEventData = async () => {
        try {
            const response = await axios.get<EventData[]>('/events/events');
            setEventData(response.data);
        } catch (error) {
            console.error('Error fetching event data:', error);
        }
    };

    const data = {
        labels: eventData.map((item) => item.event),
        datasets: [
            {
                label: 'Количество событий',
                data: eventData.map((item) => item.count),
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
            <h2>Анализ событий</h2>
            <p>
                Самое частое событие: {eventData.length > 0 ? eventData[0].event : 'Загрузка данных...'}
            </p>
            <Bar data={data} options={options} />
        </div>
    );
};

export default EventAnalysis;