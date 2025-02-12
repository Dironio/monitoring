const ConversionsMetric: React.FC = () => {
    // const [conversionsData, setConversionsData] = useState<ConversionsData[]>([]);

    // useEffect(() => {
    //     fetchConversions();
    // }, []);

    // const fetchConversions = async () => {
    //     try {
    //         const response = await axios.get<ConversionsData[]>('/events/behavior/m/coversions');
    //         setConversionsData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching conversions:', error);
    //     }
    // };

    // const data = {
    //     labels: conversionsData.map((item) => item.date),
    //     datasets: [
    //         {
    //             label: 'Конверсии',
    //             data: conversionsData.map((item) => item.count),
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
            <h2>Конверсии</h2>
            {/* <p>
                Всего конверсий за последние 7 дней: {conversionsData.length > 0 ? conversionsData[conversionsData.length - 1].count : 'Загрузка данных...'}
            </p>
            <p>
                Тенденция: {conversionsData.length > 1 ? (conversionsData[conversionsData.length - 1].count > conversionsData[conversionsData.length - 2].count ? 'Увеличивается' : 'Снижается') : 'Недостаточно данных'}
            </p>
            <Bar data={data} options={options} /> */}
        </div>
    );
};

export default ConversionsMetric;