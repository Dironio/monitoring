import { useEffect, useState } from "react";
import { Line } from "recharts";

const BounceRate: React.FC = () => {
    // const [bounceRateData, setBounceRateData] = useState<BounceRateData[]>([]);

    // useEffect(() => {
    //     fetchBounceRate();
    // }, []);

    // const fetchBounceRate = async () => {
    //     try {
    //         const response = await axios.get<BounceRateData[]>('/events/behavior/m/bounce');
    //         setBounceRateData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching bounce rate:', error);
    //     }
    // };

    // const data = {
    //     labels: bounceRateData.map((item) => item.date),
    //     datasets: [
    //         {
    //             label: 'Показатель отказов (%)',
    //             data: bounceRateData.map((item) => item.rate),
    //             borderColor: 'rgba(255, 99, 132, 1)',
    //             fill: false,
    //         },
    //     ],
    // };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return (
        <div className="metric-card">
            <h2>Показатель отказов</h2>
            {/* <p>
                Текущий BR: {bounceRateData.length > 0 ? `${bounceRateData[bounceRateData.length - 1].rate}%` : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {bounceRateData.length > 1 ? (bounceRateData[bounceRateData.length - 1].rate > bounceRateData[bounceRateData.length - 2].rate ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            <Line data={data} options={options} /> */}
        </div>
    );
};

export default BounceRate;