import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UptimeData {
    date: string;
    status: 'up' | 'down';
}

const UptimeStatus: React.FC = () => {
    const [uptimeData, setUptimeData] = useState<UptimeData[]>([]);

    useEffect(() => {
        fetchUptimeData();
    }, []);

    const fetchUptimeData = async () => {
        try {
            const response = await axios.get<UptimeData[]>('/events/uptime');
            setUptimeData(response.data);
        } catch (error) {
            console.error('Error fetching uptime data:', error);
        }
    };

    const uptimePercentage = uptimeData.length > 0
        ? ((uptimeData.filter((item) => item.status === 'up').length / uptimeData.length) * 100).toFixed(2)
        : 0;

    return (
        <div className="metric-card">
            <h2>Доступность сайта</h2>
            <p>
                Uptime за последние 7 дней: {uptimePercentage}%
            </p>
            <p>
                Последний статус: {uptimeData.length > 0 ? (uptimeData[uptimeData.length - 1].status === 'up' ? 'Доступен' : 'Недоступен') : 'Загрузка данных...'}
            </p>
        </div>
    );
};

export default UptimeStatus;