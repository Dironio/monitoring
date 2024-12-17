import './OverviewComponent.css';

const OverviewComponent = () => {
    return (
        <section className="content">
            <div className="chart">
                <h2>График посещений</h2>
                <div className="chart-placeholder">График</div>
            </div>

            <div className="table">
                <h2>Таблица</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Параметр</th>
                            <th>Значение</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Посетители</td>
                            <td>1200</td>
                        </tr>
                        <tr>
                            <td>Среднее время</td>
                            <td>5 минут</td>
                        </tr>
                        <tr>
                            <td>Отказы</td>
                            <td>20%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default OverviewComponent;