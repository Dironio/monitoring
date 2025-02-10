import { useEffect, useState } from "react";
import { Line } from "recharts";

const PageLoadingSpeed: React.FC = () => {
    // const [loadingSpeedData, setLoadingSpeedData] = useState([]);

    // useEffect(() => {
    //     fetchLoadingSpeed();
    // }, []);

    // const fetchLoadingSpeed = async () => {
    //     try {
    //         const response = await axios.get('/events/loading-speed');
    //         setLoadingSpeedData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching loading speed:', error);
    //     }
    // };

    // const data = {
    //     labels: loadingSpeedData.map((item) => item.date),
    //     datasets: [
    //         {
    //             label: 'Скорость загрузки (мс)',
    //             data: loadingSpeedData.map((item) => item.speed),
    //             borderColor: 'rgba(75, 192, 192, 1)',
    //             fill: false,
    //         },
    //     ],
    // };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="metric-card">
            <h2>Скорость загрузки страницы</h2>
            {/* <p>
                Среднее время загрузки страницы за последние 7 дней: {loadingSpeedData.length > 0 ? `${loadingSpeedData[loadingSpeedData.length - 1].speed} мс` : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {loadingSpeedData.length > 1 ? (loadingSpeedData[loadingSpeedData.length - 1].speed > loadingSpeedData[loadingSpeedData.length - 2].speed ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            <Line data={data} options={options} /> */}
        </div>
    );
};

export default PageLoadingSpeed;