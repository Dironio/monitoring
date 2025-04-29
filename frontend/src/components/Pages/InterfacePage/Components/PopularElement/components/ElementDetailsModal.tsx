import React from 'react';
import { Modal, Tabs, Row, Col, Card, Tag, Typography, Divider, Progress, Table, Statistic } from 'antd';
// import { Pie, Bar } from '@ant-design/charts';
import { ElementDetails } from './interactionTypes';
import { Bar, Pie } from '@ant-design/plots';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ElementDetailsModalProps {
    element: ElementDetails | null;
    onClose: () => void;
}

const ElementDetailsModal: React.FC<ElementDetailsModalProps> = ({ element, onClose }) => {
    if (!element) return null;

    const deviceData = element.devices.map(d => ({
        type: d.name,
        value: d.count
    }));

    const locationData = element.locations.map(l => ({
        type: l.name,
        value: l.count
    }));

    const timeData = element.time_distribution.map(t => ({
        time: t.time,
        value: t.count
    }));

    return (
        <Modal
            title={`Детали элемента: ${element.type}`}
            visible={!!element}
            onCancel={onClose}
            footer={null}
            width={900}
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab="Общая информация" key="1">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="Всего взаимодействий"
                                    value={element.total_interactions}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="Средняя длительность"
                                    value={element.avg_duration}
                                    suffix="мс"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Divider orientation="left">Классы элемента</Divider>
                    <div className="tags-container">
                        {element.classes.map(cls => (
                            <Tag key={cls.name} color="blue">
                                {cls.name} ({cls.count})
                            </Tag>
                        ))}
                    </div>
                </TabPane>

                <TabPane tab="Устройства" key="2">
                    <Card>
                        <Pie
                            data={deviceData}
                            angleField="value"
                            colorField="type"
                            radius={0.8}
                            label={{
                                type: 'spider',
                                content: '{name}: {percentage}'
                            }}
                            height={400}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="География" key="3">
                    <Card>
                        <Table
                            columns={[
                                { title: 'Локация', dataIndex: 'type', key: 'type' },
                                { title: 'Количество', dataIndex: 'value', key: 'value' }
                            ]}
                            dataSource={locationData}
                            size="small"
                            pagination={false}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="Активность" key="4">
                    <Card>
                        <Bar
                            data={timeData}
                            xField="time"
                            yField="value"
                            height={400}
                            label={{
                                position: 'middle',
                                style: { fill: '#fff' }
                            }}
                        />
                    </Card>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default ElementDetailsModal;