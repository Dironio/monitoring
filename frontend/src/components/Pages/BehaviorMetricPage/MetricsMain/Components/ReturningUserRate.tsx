import { useEffect, useState } from "react";

const ReturningUserRate: React.FC = () => {
    // const [returningRateData, setReturningRateData] = useState<ReturningRateData[]>([]);

    // useEffect(() => {
    //     fetchReturningRate();
    // }, []);

    // const fetchReturningRate = async () => {
    //     try {
    //         const response = await axios.get<ReturningRateData[]>('/events/returning-rate');
    //         setReturningRateData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching returning rate:', error);
    //     }
    // };

    // const data = {
    //     labels: returningRateData.map((item) => item.date),
    //     datasets: [
    //         {
    //             label: 'Коэффициент вернувшихся пользователей (%)',
    //             data: returningRateData.map((item) => item.rate),
    //             borderColor: 'rgba(54, 162, 235, 1)',
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
            <h2>Коэффициент вернувшихся пользователей</h2>
            {/* <p>
                Текущий RUR: {returningRateData.length > 0 ? `${returningRateData[returningRateData.length - 1].rate}%` : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {returningRateData.length > 1 ? (returningRateData[returningRateData.length - 1].rate > returningRateData[returningRateData.length - 2].rate ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            <Line data={data} options={options} /> */}
        </div>
    );
};

export default ReturningUserRate;