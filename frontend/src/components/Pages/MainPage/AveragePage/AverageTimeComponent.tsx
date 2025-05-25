// import './AverageTimeComponent.css'
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { format } from "date-fns";
// import { User } from "../../../../models/user.model";
// import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// interface AverageTimeComponentProps {
//     user: User | null;
//     loading: boolean;
// }

// interface AverageTimeMetric {
//     day: string;
//     avg_session_time: number;
//     max_session_time: number;
//     total_site_time: number;
//     total_sessions: number;
//     avg_events_per_session: number;
//     avg_pages_per_session: number;
//     bounce_rate: number;
// }

// const AverageTimeComponent: React.FC<AverageTimeComponentProps> = ({ user, loading }) => {
//     const [metrics, setMetrics] = useState<AverageTimeMetric[]>([]);
//     const [expanded, setExpanded] = useState(false);
//     const [lineChartScale, setLineChartScale] = useState(1);
//     const [barChartScale, setBarChartScale] = useState(1);
//     const [pieChartScale, setPieChartScale] = useState(1);



//     const COLORS = [
//         "hsl(var(--chart-1))",
//         "hsl(var(--chart-2))",
//         "hsl(var(--chart-3))",
//         "hsl(var(--chart-4))",
//         "hsl(var(--chart-5))",
//         "hsl(var(--chart-6))",
//     ];

//     const formatTime = (time: number | string) => {
//         // Преобразуем time в число, если это строка
//         const numericTime = typeof time === 'string' ? parseFloat(time) : time;

//         // Проверяем, что получили корректное число
//         if (isNaN(numericTime)) {
//             return "0 секунд";
//         }

//         if (numericTime > 60) {
//             return `${(numericTime / 60).toFixed(0)} минут`;
//         }
//         return `${numericTime.toFixed(2)} секунд`;
//     };

//     useEffect(() => {
//         if (loading) return;

//         if (!user) {
//             console.error("Пользователь не авторизован");
//             return;
//         }

//         const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');

//         if (!selectedSite) {
//             console.error("Сайт не выбран");
//             return;
//         }

//         const fetchMetrics = async () => {
//             try {
//                 const response = await axios.get<AverageTimeMetric[]>(
//                     `${process.env.REACT_APP_API_URL}/events/main/average-time?web_id=${selectedSite.value}`,
//                     {
//                         withCredentials: true,
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                         },
//                     }
//                 );

//                 const processedData = response.data.map(item => ({
//                     ...item,
//                     day: new Date(item.day).toISOString(),
//                     total_site_time: Math.round(Number(item.total_site_time))
//                 }));
//                 setMetrics(processedData.sort((a, b) =>
//                     new Date(a.day).getTime() - new Date(b.day).getTime()
//                 ));
//             } catch (error) {
//                 console.error("Ошибка при получении метрик сайта:", error);
//             }
//         };



//         fetchMetrics();
//     }, [user, loading]);

//     const handleScaleChange = (chartType: string, factor: number) => {
//         if (chartType === "line") {
//             setLineChartScale((prev) => Math.max(0.5, Math.min(2, prev + factor)));
//         } else if (chartType === "bar") {
//             setBarChartScale((prev) => Math.max(0.5, Math.min(2, prev + factor)));
//         } else if (chartType === "pie") {
//             setPieChartScale((prev) => Math.max(0.5, Math.min(2, prev + factor)));
//         }
//     };

//     const hasValidData = (data: AverageTimeMetric[]) => {
//         return Array.isArray(data) && data.length > 0 &&
//             data.every(item => typeof item.total_site_time === 'number' && !isNaN(item.total_site_time));
//     };

//     if (loading) {
//         return <div>Загрузка...</div>;
//     }

//     return (
//         <section className="average-time">
//             {/* Линейный график */}
//             <div className="average-time__chart">
//                 <h2 className="average-time__title">Среднее время сессий по дням</h2>
//                 <div className="average-time__scale-controls">
//                     <button onClick={() => handleScaleChange("line", -0.1)}>-</button>
//                     <span>Масштаб: {lineChartScale.toFixed(1)}x</span>
//                     <button onClick={() => handleScaleChange("line", 0.1)}>+</button>
//                 </div>
//                 <ResponsiveContainer width="100%" height={300 * lineChartScale}>
//                     <LineChart data={metrics} margin={{ top: 20, right: 30, bottom: 20, left: 50 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")} />
//                         <YAxis domain={[(dataMin: number) => Math.floor(dataMin * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.1)]} />
//                         <Tooltip content={({ payload }) => payload && payload[0]?.payload && (
//                             <div>Среднее время: {formatTime(payload[0].payload.avg_session_time)}</div>
//                         )} />
//                         <Line type="monotone" dataKey="avg_session_time" stroke="#1B998B" />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* Гистограмма */}
//             <div className="average-time__chart">
//                 <h2 className="average-time__title">Количество сессий по дням</h2>
//                 <div className="average-time__scale-controls">
//                     <button onClick={() => handleScaleChange("bar", -0.1)}>-</button>
//                     <span>Масштаб: {barChartScale.toFixed(1)}x</span>
//                     <button onClick={() => handleScaleChange("bar", 0.1)}>+</button>
//                 </div>
//                 <ResponsiveContainer width="100%" height={300 * barChartScale}>
//                     <BarChart data={metrics} margin={{ top: 20, right: 30, bottom: 20, left: 50 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" tickFormatter={(day) => format(new Date(day), "dd.MM.yyyy")} />
//                         <YAxis domain={[(dataMin: number) => Math.floor(dataMin * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.1)]} />
//                         <Tooltip content={({ payload }) => payload && payload[0]?.payload && (
//                             <div>Сессий: {payload[0].payload.total_sessions}</div>
//                         )} />
//                         <Bar dataKey="total_sessions" fill="#FF9B71" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* Круговая диаграмма */}
//             <div className="average-time__chart">
//                 <h2 className="average-time__title">Общее время по дням</h2>
//                 <div className="average-time__scale-controls">
//                     <button onClick={() => handleScaleChange("pie", -0.1)}>-</button>
//                     <span>Масштаб: {pieChartScale.toFixed(1)}x</span>
//                     <button onClick={() => handleScaleChange("pie", 0.1)}>+</button>
//                 </div>
//                 {loading ? (
//                     <div className="average-time__loading">Загрузка данных...</div>
//                 ) : hasValidData(metrics) ? (
//                     <ResponsiveContainer width="100%" height={300 * pieChartScale}>
//                         <PieChart>
//                             <Pie
//                                 data={metrics}
//                                 dataKey="total_site_time"
//                                 nameKey="day"
//                                 label={({ name }) => format(new Date(name), "dd.MM")}
//                                 outerRadius={100 * pieChartScale}
//                             >
//                                 {metrics.map((entry, index) => {
//                                     const hue = (index * 137.508) % 360;
//                                     return (
//                                         <Cell
//                                             key={`cell-${index}`}
//                                             fill={`hsl(${hue}, 70%, 50%)`}
//                                         />
//                                     );
//                                 })}
//                             </Pie>
//                             <Tooltip
//                                 formatter={(value) => [
//                                     `${Math.round(Number(value))} сек.`,
//                                     "Общее время"
//                                 ]}
//                                 labelFormatter={(label) => format(new Date(label), "dd.MM.yyyy")}
//                             />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 ) : (
//                     <div className="average-time__no-data">Нет данных для отображения</div>
//                 )}
//             </div>

//             {/* Таблица */}
//             <div className="average-time__table-container">
//                 <h2 className="average-time__title">Данные по дням</h2>
//                 <table className="average-time__table">
//                     <thead className="average-time__table-head">
//                         <tr className="average-time__table-header-row">
//                             <th className="average-time__table-header">Дата</th>
//                             <th className="average-time__table-header">Среднее время</th>
//                             <th className="average-time__table-header">Макс. время</th>
//                             <th className="average-time__table-header">Общее время</th>
//                             <th className="average-time__table-header">Сессий</th>
//                         </tr>
//                     </thead>
//                     <tbody className="average-time__table-body">
//                         {(expanded ? metrics : metrics.slice(0, 10)).map((metric) => (
//                             <tr className="average-time__table-row" key={metric.day}>
//                                 <td className="average-time__table-cell">{format(new Date(metric.day), "dd.MM.yyyy")}</td>
//                                 <td className="average-time__table-cell">{formatTime(metric.avg_session_time)}</td>
//                                 <td className="average-time__table-cell">{formatTime(metric.max_session_time)}</td>
//                                 <td className="average-time__table-cell">{formatTime(metric.total_site_time)}</td>
//                                 <td className="average-time__table-cell">{metric.total_sessions}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 {metrics.length > 10 && (
//                     <button className="average-time__expand-button" onClick={() => setExpanded(!expanded)}>
//                         {expanded ? "Свернуть" : "Развернуть"}
//                     </button>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default AverageTimeComponent;






import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell
} from 'recharts';
import "./AverageTimeComponent.css";

interface AverageTimeMetric {
    day: string;
    avg_session_time: number;
    max_session_time: number;
    total_site_time: number;
    total_sessions: number;
    avg_events_per_session: number;
    avg_pages_per_session: number;
    bounce_rate: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AverageTimeComponent = ({ user, loading }: { user: any; loading: boolean }) => {
    const [metrics, setMetrics] = useState<AverageTimeMetric[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatTime = (time: number) => {
        const numericTime = Number(time);
        if (isNaN(numericTime)) return "0 сек";

        if (numericTime >= 60) {
            const minutes = Math.floor(numericTime / 60);
            const seconds = Math.round(numericTime % 60);
            return `${minutes} мин ${seconds} сек`;
        }
        return `${Math.round(numericTime)} сек`;
    };

    const formatShortTime = (time: number) => {
        const numericTime = Number(time);
        if (isNaN(numericTime)) return "0s";
        return numericTime >= 60 ? `${Math.floor(numericTime / 60)}m` : `${Math.round(numericTime)}s`;
    };

    useEffect(() => {
        if (loading || !user) return;

        const fetchData = async () => {
            setIsFetching(true);
            try {
                const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
                if (!selectedSite) {
                    setError("Сайт не выбран");
                    return;
                }

                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/events/main/average-time?web_id=${selectedSite.value}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Ошибка загрузки данных");

                const data: AverageTimeMetric[] = await response.json();

                setMetrics(data.map(item => ({
                    ...item,
                    avg_session_time: Math.min(item.avg_session_time, 300),
                    max_session_time: Math.min(item.max_session_time, 600),
                    total_site_time: Math.min(item.total_site_time, 1800)
                })));
            } catch (err) {
                
                console.error(err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [loading, user]);

    if (isFetching) return <div className="avg-time-loading">Загрузка данных...</div>;
    if (error) return <div className="avg-time-error">{error}</div>;
    if (metrics.length === 0) return <div className="avg-time-no-data">Нет данных для отображения</div>;

    return (
        <div className="avg-time-container">
            <h2 className="avg-time-title">Анализ времени сессий</h2>

            <div className="avg-time-charts-grid">
                {/* График среднего времени сессии */}
                <div className="avg-time-chart">
                    <h3>Средняя продолжительность сессии</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis
                                dataKey="day"
                                tickFormatter={(day) => format(new Date(day), "dd.MM")}
                                tick={{ fill: '#555' }}
                            />
                            <YAxis
                                tickFormatter={(value) => formatShortTime(value)}
                                domain={[0, 'dataMax + 30']}
                                tick={{ fill: '#555' }}
                            />
                            <Tooltip
                                formatter={(value) => [formatTime(Number(value)), 'Время']}
                                labelFormatter={(label) => format(new Date(label), "dd.MM.yyyy")}
                            />
                            <Line
                                type="monotone"
                                dataKey="avg_session_time"
                                name="Среднее время"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* График количества сессий */}
                <div className="avg-time-chart">
                    <h3>Количество сессий</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis
                                dataKey="day"
                                tickFormatter={(day) => format(new Date(day), "dd.MM")}
                                tick={{ fill: '#555' }}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: '#555' }}
                            />
                            <Tooltip
                                labelFormatter={(label) => format(new Date(label), "dd.MM.yyyy")}
                            />
                            <Bar
                                dataKey="total_sessions"
                                name="Сессии"
                                fill="#82ca9d"
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Круговая диаграмма распределения времени */}
                <div className="avg-time-chart">
                    <h3>Распределение времени по дням</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={metrics}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                dataKey="total_site_time"
                                nameKey="day"
                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            >
                                {metrics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [formatTime(Number(value)), 'Время']}
                                labelFormatter={(label) => format(new Date(label), "dd.MM.yyyy")}
                            />
                            <Legend
                                formatter={(value, entry, index) => (
                                    <span style={{ color: '#333' }}>
                                        {format(new Date(value), "dd.MM")}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* График глубины просмотра */}
                <div className="avg-time-chart">
                    <h3>Глубина просмотра (страниц/сессию)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis
                                dataKey="day"
                                tickFormatter={(day) => format(new Date(day), "dd.MM")}
                                tick={{ fill: '#555' }}
                            />
                            <YAxis
                                tick={{ fill: '#555' }}
                                domain={[0, 'dataMax + 1']}
                            />
                            <Tooltip
                                labelFormatter={(label) => format(new Date(label), "dd.MM.yyyy")}
                            />
                            <Bar
                                dataKey="avg_pages_per_session"
                                name="Страниц/сессию"
                                fill="#FFBB28"
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AverageTimeComponent;