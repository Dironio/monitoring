import { useEffect, useState } from "react";
import { Line } from "recharts";

const TotalVisits: React.FC = () => {
    const [totalVisitsData, setTotalVisitsData] = useState([]);

    // useEffect(() => {
    //     fetchTotalVisits();
    // }, []);

    // const fetchTotalVisits = async () => {
    //     try {
    //         const response = await axios.get('/events/behavior/m/total-sessions');
    //         setTotalVisitsData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching total visits:', error);
    //     }
    // };

    // const data = {
    //     labels: totalVisitsData.map((item) => item.date),
    //     datasets: [
    //         {
    //             label: 'Количество визитов',
    //             data: totalVisitsData.map((item) => item.count),
    //             borderColor: 'rgba(255, 159, 64, 1)',
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
            <h2>Общее количество визитов</h2>
            {/* <p>
                Всего визитов за последние 7 дней: {totalVisitsData.length > 0 ? totalVisitsData[totalVisitsData.length - 1].count : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {totalVisitsData.length > 1 ? (totalVisitsData[totalVisitsData.length - 1].count > totalVisitsData[totalVisitsData.length - 2].count ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p> */}
            {/* <Line data={data} options={options} /> */}
        </div>
    );
};

export default TotalVisits;