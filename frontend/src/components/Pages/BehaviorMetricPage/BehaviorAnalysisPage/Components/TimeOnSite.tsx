import { useEffect, useState } from "react";
import { Line } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface TimeOnSiteData {
    date: string;
    averageTime: number;
}

const TimeOnSite: React.FC = () => {
    const [timeOnSiteData, setTimeOnSiteData] = useState<TimeOnSiteData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTimeOnSiteData();
    }, []);

    const fetchTimeOnSiteData = async () => {
        const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
        if (!selectedSite) {
            setError("Сайт не выбран");
            setLoading(false);
            return;
        }
        try {
            const response = await getAPI.get<TimeOnSiteData[]>(`/events/time-on-site?web_id=${selectedSite.value}`);
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