// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, Card, Select, Typography, Row, Col, Tag, Spin } from 'antd';
// import './PopularElement.css';
// import { useSiteContext } from '../../../../utils/SiteContext';
// import { getAPI } from '../../../../utils/axiosGet';

// const { Title, Text } = Typography;

// // Объявляем интерфейсы
// interface InteractionEvent {
//     x: number;
//     y: number;
//     duration: number;
//     element_type: string;
//     element_text: string;
//     timestamp: string;
//     session_id: string;
// }

// interface ElementStat {
//     type: string;
//     count: number;
//     avg_duration: number;
//     engagement: number;
// }

// interface HeatmapCell {
//     x: number;
//     y: number;
//     count: number;
//     elements: string[];
//     avg_duration: number;
// }

// interface ApiResponse<T> {
//     data: T;
//     status: number;
// }

// type TimeRange = '24h' | '7d' | '30d';

// const InteractionDashboard: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [interactions, setInteractions] = useState<InteractionEvent[]>([]);
//     const [elementStats, setElementStats] = useState<ElementStat[]>([]);
//     const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [timeRange, setTimeRange] = useState<TimeRange>('7d');

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!selectedSite) return;

//             setLoading(true);
//             try {
//                 const [
//                     { data: interactions },
//                     { data: elementStats },
//                     { data: heatmap }
//                 ] = await Promise.all([
//                     getAPI.get<InteractionEvent[]>(
//                         `/events/interface/interactions?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}`
//                     ),
//                     getAPI.get<ElementStat[]>(
//                         `/events/interface/element-stats?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}`
//                     ),
//                     getAPI.get<HeatmapCell[]>(
//                         `/events/interface/heatmap?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}`
//                     )
//                 ]);

//                 setInteractions(interactions);
//                 setElementStats(elementStats);
//                 setHeatmapData(heatmap);


//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [selectedSite, selectedPage, timeRange]);

//     // Колонки для таблицы тепловой карты
//     const heatmapColumns = [
//         {
//             title: 'Координаты',
//             key: 'position',
//             render: (_: any, record: HeatmapCell) => (
//                 <Text strong>{record.x}, {record.y}</Text>
//             ),
//             sorter: (a: HeatmapCell, b: HeatmapCell) =>
//                 a.x === b.x ? a.y - b.y : a.x - b.x
//         },
//         {
//             title: 'Клики',
//             dataIndex: 'count',
//             key: 'count',
//             sorter: (a: HeatmapCell, b: HeatmapCell) => a.count - b.count,
//             render: (count: number) => <Tag color="blue">{count}</Tag>
//         },
//         {
//             title: 'Длительность (мс)',
//             dataIndex: 'avg_duration',
//             key: 'avg_duration',
//             render: (duration: number) => Math.round(duration),
//             sorter: (a: HeatmapCell, b: HeatmapCell) => a.avg_duration - b.avg_duration
//         },
//         {
//             title: 'Элементы',
//             dataIndex: 'elements',
//             key: 'elements',
//             render: (elements: string[]) => (
//                 <div style={{ maxWidth: 300 }}>
//                     {elements.slice(0, 3).map((el, i) => (
//                         <Tag key={i} color={el === 'BUTTON' ? 'green' : 'geekblue'}>{el}</Tag>
//                     ))}
//                     {elements.length > 3 && <Tag>+{elements.length - 3}</Tag>}
//                 </div>
//             )
//         }
//     ];

//     // Колонки для статистики по элементам
//     const elementColumns = [
//         {
//             title: 'Тип элемента',
//             dataIndex: 'type',
//             key: 'type',
//             render: (type: string) => (
//                 <Tag color={type === 'BUTTON' ? 'green' :
//                     type === 'LINK' ? 'orange' :
//                         type === 'INPUT' ? 'purple' : 'blue'}>
//                     {type}
//                 </Tag>
//             )
//         },
//         {
//             title: 'Количество',
//             dataIndex: 'count',
//             key: 'count',
//             sorter: (a: ElementStat, b: ElementStat) => a.count - b.count,
//             render: (count: number) => <Text strong>{count}</Text>
//         },
//         {
//             title: 'Ср. длительность (мс)',
//             dataIndex: 'avg_duration',
//             key: 'avg_duration',
//             render: (duration: number) => Math.round(duration)
//         },
//         {
//             title: 'Вовлечённость',
//             dataIndex: 'engagement',
//             key: 'engagement',
//             render: (engagement: number) => (
//                 <div style={{ width: '100%' }}>
//                     <div style={{
//                         width: `${engagement}%`,
//                         backgroundColor: engagement > 70 ? '#52c41a' :
//                             engagement > 40 ? '#faad14' : '#ff4d4f',
//                         height: '20px',
//                         borderRadius: '4px'
//                     }} />
//                     <Text>{engagement}/100</Text>
//                 </div>
//             )
//         }
//     ];

//     return (
//         <div className="analytics-container">
//             <Card
//                 title={
//                     <Title level={4} style={{ margin: 0 }}>
//                         Аналитика взаимодействий: {selectedPage?.label || 'Весь сайт'}
//                     </Title>
//                 }
//                 extra={
//                     <Select
//                         value={timeRange}
//                         onChange={setTimeRange}
//                         style={{ width: 150 }}
//                         disabled={loading}
//                     >
//                         <Select.Option value="24h">24 часа</Select.Option>
//                         <Select.Option value="7d">7 дней</Select.Option>
//                         <Select.Option value="30d">30 дней</Select.Option>
//                     </Select>
//                 }
//             >
//                 <Spin spinning={loading}>
//                     <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
//                         <Col span={24}>
//                             <Card
//                                 title={<Text strong>Тепловая карта кликов</Text>}
//                                 bordered={false}
//                             >
//                                 <Table
//                                     columns={heatmapColumns}
//                                     dataSource={heatmapData}
//                                     rowKey={record => `${record.x}-${record.y}`}
//                                     pagination={{ pageSize: 10 }}
//                                     scroll={{ x: true }}
//                                     size="small"
//                                 />
//                             </Card>
//                         </Col>
//                     </Row>

//                     <Row gutter={[16, 16]}>
//                         <Col span={24}>
//                             <Card
//                                 title={<Text strong>Статистика по элементам</Text>}
//                                 bordered={false}
//                             >
//                                 <Table
//                                     columns={elementColumns}
//                                     dataSource={elementStats}
//                                     rowKey="type"
//                                     pagination={{ pageSize: 10 }}
//                                     size="small"
//                                 />
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Spin>
//             </Card>
//         </div>
//     );
// };

// export default InteractionDashboard;











import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Select, Typography, Row, Col, Tag, Spin, Modal, Progress } from 'antd';
import './PopularElement.css';
import { useSiteContext } from '../../../../utils/SiteContext';
import { getAPI } from '../../../../utils/axiosGet';
import { Heatmap, G2 } from '@ant-design/plots';

const { Title, Text } = Typography;

interface InteractionEvent {
    x: number;
    y: number;
    duration: number;
    element_type: string;
    element_text: string;
    element_class?: string;
    timestamp: string;
    session_id: string;
}

interface ElementStat {
    type: string;
    count: number;
    avg_duration: number;
    engagement: number;
    classes?: string[];
    miss_rate?: number;
}

interface HeatmapCell {
    x: number;
    y: number;
    count: number;
    elements: string[];
    avg_duration: number;
    element_details?: {
        type: string;
        text: string;
        class: string;
    }[];
}

type TimeRange = '24h' | '7d' | '30d';

const InteractionDashboard: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [interactions, setInteractions] = useState<InteractionEvent[]>([]);
    const [elementStats, setElementStats] = useState<ElementStat[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [selectedElement, setSelectedElement] = useState<ElementStat | null>(null);
    const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<HeatmapCell | null>(null);

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
                        `/events/interface/element-stats?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&with_details=true`
                    ),
                    getAPI.get<HeatmapCell[]>(
                        `/events/interface/heatmap?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&with_details=true`
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

    // Визуализация тепловой карты
    const HeatmapVisualization = () => {
        if (heatmapData.length === 0) return <div>Нет данных для отображения</div>;

        const data = heatmapData.map(cell => ({
            x: cell.x,
            y: cell.y,
            value: cell.count,
            elements: cell.elements.join(', '),
            duration: Math.round(cell.avg_duration)
        }));

        const config = {
            data,
            xField: 'x',
            yField: 'y',
            colorField: 'value',
            shape: 'square',
            sizeRatio: 1,
            color: ['#dddddd', '#ffd8bf', '#ffbb96', '#ff9c6e', '#ff7a45', '#fa541c', '#d4380d', '#ad2102'],
            label: {
                style: {
                    fill: '#fff',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, 0.45)'
                },
                formatter: (datum: any) => `${datum.value}`
            },
            tooltip: {
                fields: ['x', 'y', 'value', 'elements', 'duration'],
                formatter: (datum: any) => {
                    return {
                        name: `Координаты: ${datum.x}, ${datum.y}`,
                        value: `Кликов: ${datum.value}\nЭлементы: ${datum.elements}\nСр. длительность: ${datum.duration}мс`
                    };
                }
            },
            interactions: [
                {
                    type: 'element-active',
                    cfg: {
                        start: [
                            {
                                trigger: 'element:mouseenter',
                                action: 'cursor:pointer'
                            }
                        ]
                    }
                }
            ],
            onClick: (data: any) => {
                const cell = heatmapData.find(c => c.x === data.x && c.y === data.y);
                if (cell) setSelectedHeatmapCell(cell);
            }
        };

        return <Heatmap {...config} />;
    };

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
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: HeatmapCell) => (
                <a onClick={() => setSelectedHeatmapCell(record)}>Подробнее</a>
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
                <Progress 
                    percent={engagement} 
                    strokeColor={{
                        '0%': '#ff4d4f',
                        '50%': '#faad14',
                        '100%': '#52c41a'
                    }}
                    format={percent => `${percent}/100`}
                />
            )
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: ElementStat) => (
                <a onClick={() => setSelectedElement(record)}>Подробнее</a>
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
                                title={<Text strong>Визуализация кликов</Text>}
                                bordered={false}
                            >
                                <HeatmapVisualization />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                        <Col span={24}>
                            <Card
                                title={<Text strong>Данные по координатам кликов</Text>}
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

            {/* Модальное окно для деталей элемента */}
            <Modal
                title={`Детали элемента: ${selectedElement?.type}`}
                visible={!!selectedElement}
                onCancel={() => setSelectedElement(null)}
                footer={null}
                width={700}
            >
                {selectedElement && (
                    <div>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Card title="Основная информация" size="small">
                                    <p><strong>Тип:</strong> {selectedElement.type}</p>
                                    <p><strong>Количество взаимодействий:</strong> {selectedElement.count}</p>
                                    <p><strong>Средняя длительность:</strong> {Math.round(selectedElement.avg_duration)} мс</p>
                                    <p><strong>Вовлечённость:</strong> {selectedElement.engagement}/100</p>
                                    {selectedElement.miss_rate !== undefined && (
                                        <p>
                                            <strong>Процент промахов:</strong> 
                                            <Progress 
                                                percent={Math.round(selectedElement.miss_rate * 100)} 
                                                status="active"
                                                strokeColor="#ff4d4f"
                                            />
                                        </p>
                                    )}
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Классы элемента" size="small">
                                    {selectedElement.classes?.length ? (
                                        <div>
                                            <p>Найденные классы:</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {selectedElement.classes.map((cls, i) => (
                                                    <Tag key={i} color="magenta">{cls}</Tag>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p>Классы не найдены</p>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                        <Card title="Примеры элементов" size="small">
                            <p>Здесь могут отображаться примеры элементов этого типа с их текстом и классами</p>
                        </Card>
                    </div>
                )}
            </Modal>

            {/* Модальное окно для деталей тепловой карты */}
            <Modal
                title={`Детали кликов в координатах ${selectedHeatmapCell?.x}, ${selectedHeatmapCell?.y}`}
                visible={!!selectedHeatmapCell}
                onCancel={() => setSelectedHeatmapCell(null)}
                footer={null}
                width={700}
            >
                {selectedHeatmapCell && (
                    <div>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Card title="Основная информация" size="small">
                                    <p><strong>Координаты:</strong> {selectedHeatmapCell.x}, {selectedHeatmapCell.y}</p>
                                    <p><strong>Количество кликов:</strong> {selectedHeatmapCell.count}</p>
                                    <p><strong>Средняя длительность:</strong> {Math.round(selectedHeatmapCell.avg_duration)} мс</p>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Типы элементов" size="small">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {selectedHeatmapCell.elements.map((el, i) => (
                                            <Tag key={i} color={el === 'BUTTON' ? 'green' : 'geekblue'}>{el}</Tag>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Card title="Детали элементов" size="small">
                            {selectedHeatmapCell.element_details?.length ? (
                                <Table
                                    columns={[
                                        { title: 'Тип', dataIndex: 'type', key: 'type' },
                                        { title: 'Текст', dataIndex: 'text', key: 'text' },
                                        { title: 'Класс', dataIndex: 'class', key: 'class' }
                                    ]}
                                    dataSource={selectedHeatmapCell.element_details}
                                    size="small"
                                    pagination={false}
                                />
                            ) : (
                                <p>Детальная информация об элементах не найдена</p>
                            )}
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InteractionDashboard;