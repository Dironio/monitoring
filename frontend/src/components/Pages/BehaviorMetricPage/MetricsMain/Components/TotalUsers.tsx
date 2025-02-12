import { useEffect, useState } from "react";

const TotalUsers: React.FC = () => {
    const [totalUsersData, setTotalUsersData] = useState([]);

    // useEffect(() => {
    //     fetchTotalUsers();
    // }, []);

    // const fetchTotalUsers = async () => {
    //     try {
    //         const response = await axios.get('/events/behavior/m/total-users');
    //         setTotalUsersData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching total users:', error);
    //     }
    // };

    // const data = {
    //     labels: totalUsersData.map((item) => item.date),
    //     datasets: [
    //         {
    //             label: 'Количество пользователей',
    //             data: totalUsersData.map((item) => item.count),
    //             backgroundColor: 'rgba(153, 102, 255, 0.2)',
    //             borderColor: 'rgba(153, 102, 255, 1)',
    //             borderWidth: 1,
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
            <h2>Общее количество пользователей</h2>
            {/* <p>
                Всего пользователей за последние 7 дней: {totalUsersData.length > 0 ? totalUsersData[totalUsersData.length - 1].count : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {totalUsersData.length > 1 ? (totalUsersData[totalUsersData.length - 1].count > totalUsersData[totalUsersData.length - 2].count ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            <Bar data={data} options={options} /> */}
        </div>
    );
};

export default TotalUsers;