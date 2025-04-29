import React from 'react';
import { Modal, Descriptions, Table, Typography, Card, Tag, Progress } from 'antd';
// import { Pie } from '@ant-design/charts';
import { ClickDetails } from './interactionTypes';
import { Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

interface ClickDetailsModalProps {
    cell: ClickDetails | null;
    onClose: () => void;
}

interface ElementChartData {
    type: string;
    value: number;
}

interface DeviceTableRecord {
    device: string;
    count: number;
    percentage: number;
}

const ClickDetailsModal: React.FC<ClickDetailsModalProps> = ({ cell, onClose }) => {
    if (!cell) return null;

    const elementData: ElementChartData[] = cell.elements.map(e => ({
        type: e.type,
        value: e.count
    }));

    const deviceData: DeviceTableRecord[] = cell.devices.map(d => ({
        device: d.device,
        count: d.count,
        percentage: d.percentage
    }));

    return (
        <Modal
            title={`Детали кликов в координатах ${cell.coordinates.x}, ${cell.coordinates.y}`}
            visible={!!cell}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Всего кликов">
                    <Text strong>{cell.total_clicks}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Средняя длительность">
                    <Text strong>{cell.avg_duration} мс</Text>
                </Descriptions.Item>
            </Descriptions>

            <Card title="Элементы" style={{ marginTop: 16 }}>
                <Pie
                    data={elementData}
                    angleField="value"
                    colorField="type"
                    radius={0.7}
                    label={{
                        type: 'spider',
                        content: '{name}: {percentage}'
                    }}
                    height={300}
                />
            </Card>

            <Card title="Устройства" style={{ marginTop: 16 }}>
                <Table<DeviceTableRecord>
                    columns={[
                        {
                            title: 'Устройство',
                            dataIndex: 'device',
                            key: 'device',
                            render: (text: string) => <Tag color="blue">{text}</Tag>
                        },
                        {
                            title: 'Количество',
                            dataIndex: 'count',
                            key: 'count',
                            sorter: (a, b) => a.count - b.count
                        },
                        {
                            title: 'Процент',
                            key: 'percentage',
                            render: (_: any, record: DeviceTableRecord) => (
                                <Progress
                                    percent={record.percentage}
                                    size="small"
                                    status="active"
                                    format={percent => `${percent}%`}
                                />
                            )
                        }
                    ]}
                    dataSource={deviceData}
                    size="small"
                    pagination={false}
                    rowKey="device"
                />
            </Card>

            <Card title="Локации" style={{ marginTop: 16 }}>
                <Table
                    columns={[
                        {
                            title: 'Локация',
                            dataIndex: 'location',
                            key: 'location'
                        },
                        {
                            title: 'Количество',
                            dataIndex: 'count',
                            key: 'count'
                        },
                        {
                            title: 'Процент',
                            key: 'percentage',
                            render: (_: any, record: any) => (
                                <Progress
                                    percent={record.percentage}
                                    size="small"
                                    status="active"
                                />
                            )
                        }
                    ]}
                    dataSource={cell.locations}
                    size="small"
                    pagination={false}
                />
            </Card>
        </Modal>
    );
};

export default ClickDetailsModal;