import { useEffect, useState } from "react";
import { Line } from "recharts";

interface TimeOnSiteData {
    date: string;
    averageTime: number;
}

const TimeOnSite: React.FC = () => {
    const [timeOnSiteData, setTimeOnSiteData] = useState<TimeOnSiteData[]>([]);

    useEffect(() => {
        fetchTimeOnSiteData();
    }, []);

    const fetchTimeOnSiteData = async () => {
        try {
            const response = await axios.get<TimeOnSiteData[]>('/events/time-on-site');
            setTimeOnSiteData(response.data);
        } catch (error) {
            console.error('Error fetching time on site data:', error);
        }
    };

    const data = {
        labels: timeOnSiteData.map((item) => item.date),
        datasets: [
            {
                label: 'Среднее время на сайте (сек)',
                data: timeOnSiteData.map((item) => item.averageTime),
                borderColor: 'rgba(75, 192, 192, 1)',
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
            <h2>Время на сайте</h2>
            <p>
                Среднее время за последние 7 дней: {timeOnSiteData.length > 0 ? `${timeOnSiteData[timeOnSiteData.length - 1].averageTime} сек` : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {timeOnSiteData.length > 1 ? (timeOnSiteData[timeOnSiteData.length - 1].averageTime > timeOnSiteData[timeOnSiteData.length - 2].averageTime ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            {/* <Line data={data} options={options} /> */}
        </div>
    );
};

export default TimeOnSite;