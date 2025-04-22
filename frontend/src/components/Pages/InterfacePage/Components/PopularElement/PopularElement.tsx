// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//     ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell
// } from 'recharts';
// import './PopularElement.css';
// import { useSiteContext } from '../../../../utils/SiteContext';
// import { getAPI } from '../../../../utils/axiosGet';

// interface InteractionEvent {
//     x: number;
//     y: number;
//     duration: number;
//     elementType: string;
//     elementText: string;
//     timestamp: string;
//     sessionId: string;
// }

// interface ElementStats {
//     type: string;
//     count: number;
//     avgDuration: number;
//     clickRate?: number;
//     engagement?: number;
// }

// interface ScrollData {
//     scrollPercentage: number;
//     timestamp: string;
//     sessionId: string;
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// const InteractionDashboard: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [interactions, setInteractions] = useState<InteractionEvent[]>([]);
//     const [scrollData, setScrollData] = useState<ScrollData[]>([]);
//     const [elementStats, setElementStats] = useState<ElementStats[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

//     // Математическая функция для расчета коэффициента вовлеченности
//     const calculateEngagement = (duration: number, clicks: number) => {
//         // Нормализованная логарифмическая функция
//         return Math.log1p(duration * clicks) * 10;
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!selectedSite || !selectedPage) return;

//             setLoading(true);
//             try {
//                 const interactionsRes = await getAPI.get<InteractionEvent[]>(
//                     `/events/interface/interactions?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage.value)}&range=${timeRange}`
//                 );

//                 const scrollRes = await getAPI.get<ScrollData[]>(
//                     `/events/interface/scroll?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage.value)}&range=${timeRange}`
//                 );

//                 setInteractions(interactionsRes.data);
//                 setScrollData(scrollRes.data);

//                 // Анализ данных по элементам
//                 const statsMap: Record<string, { count: number, totalDuration: number }> = {};

//                 interactionsRes.data.forEach((event: InteractionEvent) => {
//                     if (!statsMap[event.elementType]) {
//                         statsMap[event.elementType] = { count: 0, totalDuration: 0 };
//                     }
//                     statsMap[event.elementType].count += 1;
//                     statsMap[event.elementType].totalDuration += event.duration;
//                 });

//                 const stats = Object.entries(statsMap).map(([type, { count, totalDuration }]) => ({
//                     type,
//                     count,
//                     avgDuration: totalDuration / count,
//                     engagement: calculateEngagement(totalDuration, count)
//                 }));

//                 setElementStats(stats.sort((a, b) => b.count - a.count));
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [selectedSite, selectedPage, timeRange]);

//     // Форматирование данных для диаграмм
//     const getTopElements = (limit = 5) => elementStats.slice(0, limit);
//     const getScrollDistribution = () => {
//         const buckets = Array(10).fill(0).map((_, i) => ({
//             range: `${i * 10}-${(i + 1) * 10}%`,
//             count: 0
//         }));

//         scrollData.forEach(({ scrollPercentage }) => {
//             const bucketIndex = Math.floor(scrollPercentage / 10);
//             if (bucketIndex >= 0 && bucketIndex < 10) {
//                 buckets[bucketIndex].count += 1;
//             }
//         });

//         return buckets;
//     };

//     // Рассчет позиций кликов для scatter plot
//     const getClickPositions = () => interactions.map(({ x, y, duration }) => ({
//         x,
//         y: -y, // Инвертируем Y для корректного отображения
//         duration
//     }));

//     return (
//         <div className="dashboard-container">
//             <div className="dashboard-header">
//                 <h2>Анализ взаимодействий: {selectedPage?.label}</h2>
//                 <div className="controls">
//                     <select
//                         value={timeRange}
//                         onChange={(e) => setTimeRange(e.target.value as any)}
//                         disabled={loading}
//                     >
//                         <option value="24h">Последние 24 часа</option>
//                         <option value="7d">Последние 7 дней</option>
//                         <option value="30d">Последние 30 дней</option>
//                     </select>
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="loading-spinner">Загрузка данных...</div>
//             ) : (
//                 <>
//                     <div className="metrics-row">
//                         <div className="metric-card">
//                             <h3>Всего взаимодействий</h3>
//                             <p className="metric-value">{interactions.length}</p>
//                         </div>
//                         <div className="metric-card">
//                             <h3>Уникальных сессий</h3>
//                             <p className="metric-value">
//                                 {new Set(interactions.map(i => i.sessionId)).size}
//                             </p>
//                         </div>
//                         <div className="metric-card">
//                             <h3>Средняя глубина скролла</h3>
//                             <p className="metric-value">
//                                 {/* {scrollData.length > 0 
//                   ? Math.round(scrollData.reduce((sum, d) => sum + d.scrollPercentage, 0) / scrollData.length
//                   : 0}
//                 )))} */}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="charts-row">
//                         <div className="chart-container">
//                             <h3>Распределение кликов по элементам</h3>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <BarChart data={getTopElements()}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="type" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#8884d8" name="Количество кликов" />
//                                     <Bar dataKey="avgDuration" fill="#82ca9d" name="Ср. длительность (мс)" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </div>

//                         <div className="chart-container">
//                             <h3>Типы элементов (топ-5)</h3>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <PieChart>
//                                     <Pie
//                                         data={getTopElements(5)}
//                                         cx="50%"
//                                         cy="50%"
//                                         labelLine={false}
//                                         outerRadius={80}
//                                         fill="#8884d8"
//                                         dataKey="count"
//                                         nameKey="type"
//                                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                     >
//                                         {getTopElements(5).map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>

//                     <div className="charts-row">
//                         <div className="chart-container">
//                             <h3>Глубина скролла пользователей</h3>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <BarChart data={getScrollDistribution()}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="range" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Bar dataKey="count" fill="#ffc658" name="Количество пользователей" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </div>

//                         <div className="chart-container">
//                             <h3>Карта кликов (X/Y координаты)</h3>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <ScatterChart
//                                     margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//                                 >
//                                     <CartesianGrid />
//                                     <XAxis type="number" dataKey="x" name="X" unit="px" domain={[0, 1920]} />
//                                     <YAxis type="number" dataKey="y" name="Y" unit="px" domain={[-1080, 0]} />
//                                     <ZAxis type="number" dataKey="duration" range={[10, 1000]} />
//                                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                                     <Scatter name="Клики" data={getClickPositions()} fill="#8884d8" />
//                                 </ScatterChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>

//                     <div className="stats-table">
//                         <h3>Подробная статистика по элементам</h3>
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>Тип элемента</th>
//                                     <th>Количество кликов</th>
//                                     <th>Средняя длительность (мс)</th>
//                                     <th>Уровень вовлеченности</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {elementStats.map((stat, index) => (
//                                     <tr key={index}>
//                                         <td>{stat.type}</td>
//                                         <td>{stat.count}</td>
//                                         <td>{Math.round(stat.avgDuration)}</td>
//                                         <td>
//                                             <div className="flex items-center gap-2">
//                                                 <div className="bg-blue-100 h-2 rounded w-full">
//                                                     <div
//                                                         className="bg-blue-500 h-2 rounded"
//                                                         style={{ width: `${Math.min(100, stat.engagement ?? 0)}%` }}
//                                                     />
//                                                 </div>
//                                                 <span>{Math.round(stat.engagement ?? 0)}/100</span>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default InteractionDashboard;
































import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Select, Typography, Row, Col, Tag, Spin } from 'antd';
import './PopularElement.css';
import { useSiteContext } from '../../../../utils/SiteContext';
import { getAPI } from '../../../../utils/axiosGet';

const { Title, Text } = Typography;

// Объявляем интерфейсы
interface InteractionEvent {
    x: number;
    y: number;
    duration: number;
    element_type: string;
    element_text: string;
    timestamp: string;
    session_id: string;
}

interface ElementStat {
    type: string;
    count: number;
    avg_duration: number;
    engagement: number;
}

interface HeatmapCell {
    x: number;
    y: number;
    count: number;
    elements: string[];
    avg_duration: number;
}

interface ApiResponse<T> {
    data: T;
    status: number;
}

type TimeRange = '24h' | '7d' | '30d';

const InteractionDashboard: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [interactions, setInteractions] = useState<InteractionEvent[]>([]);
    const [elementStats, setElementStats] = useState<ElementStat[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSite) return;

            setLoading(true);
            try {
                const [
                    { data: interactions },
                    { data: elementStats },
                    { data: heatmap }
                ] = await Promise.all([
                    getAPI.get<InteractionEvent[]>(
                        `/events/interface/interactions?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}`
                    ),
                    getAPI.get<ElementStat[]>(
                        `/events/interface/element-stats?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}`
                    ),
                    getAPI.get<HeatmapCell[]>(
                        `/events/interface/heatmap?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}`
                    )
                ]);

                setInteractions(interactions);
                setElementStats(elementStats);
                setHeatmapData(heatmap);


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSite, selectedPage, timeRange]);

    // Колонки для таблицы тепловой карты
    const heatmapColumns = [
        {
            title: 'Координаты',
            key: 'position',
            render: (_: any, record: HeatmapCell) => (
                <Text strong>{record.x}, {record.y}</Text>
            ),
            sorter: (a: HeatmapCell, b: HeatmapCell) =>
                a.x === b.x ? a.y - b.y : a.x - b.x
        },
        {
            title: 'Клики',
            dataIndex: 'count',
            key: 'count',
            sorter: (a: HeatmapCell, b: HeatmapCell) => a.count - b.count,
            render: (count: number) => <Tag color="blue">{count}</Tag>
        },
        {
            title: 'Длительность (мс)',
            dataIndex: 'avg_duration',
            key: 'avg_duration',
            render: (duration: number) => Math.round(duration),
            sorter: (a: HeatmapCell, b: HeatmapCell) => a.avg_duration - b.avg_duration
        },
        {
            title: 'Элементы',
            dataIndex: 'elements',
            key: 'elements',
            render: (elements: string[]) => (
                <div style={{ maxWidth: 300 }}>
                    {elements.slice(0, 3).map((el, i) => (
                        <Tag key={i} color={el === 'BUTTON' ? 'green' : 'geekblue'}>{el}</Tag>
                    ))}
                    {elements.length > 3 && <Tag>+{elements.length - 3}</Tag>}
                </div>
            )
        }
    ];

    // Колонки для статистики по элементам
    const elementColumns = [
        {
            title: 'Тип элемента',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={type === 'BUTTON' ? 'green' :
                    type === 'LINK' ? 'orange' :
                        type === 'INPUT' ? 'purple' : 'blue'}>
                    {type}
                </Tag>
            )
        },
        {
            title: 'Количество',
            dataIndex: 'count',
            key: 'count',
            sorter: (a: ElementStat, b: ElementStat) => a.count - b.count,
            render: (count: number) => <Text strong>{count}</Text>
        },
        {
            title: 'Ср. длительность (мс)',
            dataIndex: 'avg_duration',
            key: 'avg_duration',
            render: (duration: number) => Math.round(duration)
        },
        {
            title: 'Вовлечённость',
            dataIndex: 'engagement',
            key: 'engagement',
            render: (engagement: number) => (
                <div style={{ width: '100%' }}>
                    <div style={{
                        width: `${engagement}%`,
                        backgroundColor: engagement > 70 ? '#52c41a' :
                            engagement > 40 ? '#faad14' : '#ff4d4f',
                        height: '20px',
                        borderRadius: '4px'
                    }} />
                    <Text>{engagement}/100</Text>
                </div>
            )
        }
    ];

    return (
        <div className="analytics-container">
            <Card
                title={
                    <Title level={4} style={{ margin: 0 }}>
                        Аналитика взаимодействий: {selectedPage?.label || 'Весь сайт'}
                    </Title>
                }
                extra={
                    <Select
                        value={timeRange}
                        onChange={setTimeRange}
                        style={{ width: 150 }}
                        disabled={loading}
                    >
                        <Select.Option value="24h">24 часа</Select.Option>
                        <Select.Option value="7d">7 дней</Select.Option>
                        <Select.Option value="30d">30 дней</Select.Option>
                    </Select>
                }
            >
                <Spin spinning={loading}>
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                        <Col span={24}>
                            <Card
                                title={<Text strong>Тепловая карта кликов</Text>}
                                bordered={false}
                            >
                                <Table
                                    columns={heatmapColumns}
                                    dataSource={heatmapData}
                                    rowKey={record => `${record.x}-${record.y}`}
                                    pagination={{ pageSize: 10 }}
                                    scroll={{ x: true }}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card
                                title={<Text strong>Статистика по элементам</Text>}
                                bordered={false}
                            >
                                <Table
                                    columns={elementColumns}
                                    dataSource={elementStats}
                                    rowKey="type"
                                    pagination={{ pageSize: 10 }}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            </Card>
        </div>
    );
};

export default InteractionDashboard;