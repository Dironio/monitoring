import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Row, Col, Card, Tag, Typography, Divider, Progress, Table, Statistic, Spin, Alert, Descriptions } from 'antd';
// import { Pie, Bar } from '@ant-design/charts';
import { ElementDetails } from './interactionTypes';
import { Bar, Pie } from '@ant-design/plots';
import { getAPI } from '../../../../../utils/axiosGet';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ElementDetailsModalProps {
    elementType: string;
    webId: number;
    pageUrl: string;
    range: string;
    onClose: () => void;
}

const ElementDetailsModal: React.FC<ElementDetailsModalProps> = ({
    elementType,
    webId,
    pageUrl,
    range,
    onClose
}) => {
    const [details, setDetails] = useState<ElementDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getAPI.get<ElementDetails>(
                    `/events/interface/element-details?web_id=${webId}&page_url=${encodeURIComponent(pageUrl)}&range=${range}&element_type=${elementType}`
                );

                console.log('Ответ element-details API:', response);

                // Получаем данные из ответа API
                const detailsData = response.data;

                console.log('Данные element-details:', detailsData);

                // Преобразуем строковые значения в числовые, если необходимо
                const processedDetails: ElementDetails = {
                    type: detailsData.type,
                    total_interactions: typeof detailsData.total_interactions === 'string'
                        ? parseInt(detailsData.total_interactions, 10)
                        : detailsData.total_interactions,
                    avg_duration: typeof detailsData.avg_duration === 'string'
                        ? parseFloat(detailsData.avg_duration)
                        : detailsData.avg_duration,
                    classes: Array.isArray(detailsData.classes)
                        ? detailsData.classes.map(cls => ({
                            name: cls.name,
                            count: typeof cls.count === 'string' ? parseInt(cls.count, 10) : cls.count
                        }))
                        : [],
                    devices: Array.isArray(detailsData.devices)
                        ? detailsData.devices.map(dev => ({
                            name: dev.name,
                            count: typeof dev.count === 'string' ? parseInt(dev.count, 10) : dev.count
                        }))
                        : [],
                    locations: Array.isArray(detailsData.locations)
                        ? detailsData.locations.map(loc => ({
                            name: loc.name,
                            count: typeof loc.count === 'string' ? parseInt(loc.count, 10) : loc.count
                        }))
                        : [],
                    time_distribution: Array.isArray(detailsData.time_distribution)
                        ? detailsData.time_distribution.map(timePoint => ({
                            time: timePoint.time,
                            count: typeof timePoint.count === 'string' ? parseInt(timePoint.count, 10) : timePoint.count
                        }))
                        : []
                };

                console.log('Обработанные данные element-details:', processedDetails);

                setDetails(processedDetails);
            } catch (error) {
                console.error('Error fetching element details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [elementType, webId, pageUrl, range]);

    if (!details && !loading) {
        return (
            <Modal
                title={`Детали элемента: ${elementType}`}
                visible={true}
                onCancel={onClose}
                footer={null}
                width={700}
            >
                <Alert
                    message="Ошибка загрузки данных"
                    description="Не удалось загрузить детали элемента. Пожалуйста, попробуйте позже."
                    type="error"
                />
            </Modal>
        );
    }

    if (!details) return null;

    return (
        <Modal
            title={`Детали элемента: ${elementType}`}
            visible={true}
            onCancel={onClose}
            footer={null}
            width={900}
            bodyStyle={{ padding: '16px 24px' }}
        >
            <Spin spinning={loading}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Общая информация" key="1">
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Card title="Основные показатели">
                                    <Descriptions column={1}>
                                        <Descriptions.Item label="Всего взаимодействий">
                                            <Text strong>{details.total_interactions}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Средняя длительность">
                                            <Text strong>{Math.round(details.avg_duration)} мс</Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Классы элемента">
                                    {details.classes?.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {details.classes.map(cls => (
                                                <Tag key={cls.name} color="blue">
                                                    {cls.name} ({cls.count})
                                                </Tag>
                                            ))}
                                        </div>
                                    ) : (
                                        <Text type="secondary">Нет данных о классах</Text>
                                    )}
                                </Card>
                            </Col>
                        </Row>

                        {/* <Card title="Примеры элементов">
                            {details.element_examples?.length > 0 ? (
                                <Table
                                    columns={[
                                        { title: 'Текст', dataIndex: 'text' },
                                        { title: 'Классы', dataIndex: 'classes', render: cls => cls?.join(', ') || 'Нет' }
                                    ]}
                                    dataSource={details.element_examples}
                                    size="small"
                                    pagination={false}
                                    rowKey={(record) => `${record.text}-${record.classes?.join('-')}`}
                                />
                            ) : (
                                <Text type="secondary">Нет примеров элементов</Text>
                            )}
                        </Card> */}
                    </TabPane>

                    <TabPane tab="Устройства" key="2" forceRender>
                        <Card>
                            {/* {deviceData.length > 0 ? (
                                <Pie
                                    data={deviceData}
                                    angleField="value"
                                    colorField="type"
                                    radius={0.8}
                                    innerRadius={0.4}
                                    label={{
                                        type: 'spider',
                                        content: '{name}: {percentage}'
                                    }}
                                    height={400}
                                    legend={{
                                        position: 'bottom'
                                    }}
                                />
                            ) : (
                                <Text type="secondary">Нет данных об устройствах</Text>
                            )} */}
                        </Card>
                    </TabPane>

                    <TabPane tab="География" key="3" forceRender>
                        <Card>
                            {details.locations?.length > 0 ? (
                                <Table
                                    columns={[
                                        { title: 'Локация', dataIndex: 'name' },
                                        { title: 'Количество', dataIndex: 'count' }
                                    ]}
                                    dataSource={details.locations}
                                    size="small"
                                    pagination={false}
                                    rowKey="name"
                                />
                            ) : (
                                <Text type="secondary">Нет данных о географии</Text>
                            )}
                        </Card>
                    </TabPane>
                </Tabs>
            </Spin>
        </Modal>
    );
};

export default ElementDetailsModal;