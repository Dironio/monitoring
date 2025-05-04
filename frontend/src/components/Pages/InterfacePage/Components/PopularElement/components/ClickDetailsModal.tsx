import React from 'react';
import { Modal, Descriptions, Table, Typography, Card, Tag, Progress } from 'antd';
// import { Pie } from '@ant-design/charts';
import { Pie } from '@ant-design/plots';
import { ClickDetails } from './interactionTypes';

const { Title, Text } = Typography;

interface ClickDetailsModalProps {
    cell: ClickDetails;
    onClose: () => void;
}

const ClickDetailsModal: React.FC<ClickDetailsModalProps> = ({ cell, onClose }) => {
    const elementData = cell.element_details?.reduce((acc, detail) => {
        const existing = acc.find(item => item.type === detail.type);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ type: detail.type, value: 1 });
        }
        return acc;
    }, [] as Array<{ type: string; value: number }>) || [];

    const deviceData = cell.element_details?.reduce((acc, detail) => {
        const device = `${detail.os} ${detail.browser}`;
        const existing = acc.find(item => item.type === device);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ type: device, value: 1 });
        }
        return acc;
    }, [] as Array<{ type: string; value: number }>) || [];

    return (
        <Modal
            title={`Детали кликов в координатах ${cell.x}, ${cell.y}`}
            visible={true}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Всего кликов">
                    <Text strong>{cell.count}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Средняя длительность">
                    <Text strong>{Math.round(cell.avg_duration)} мс</Text>
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
                <Pie
                    data={deviceData}
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
        </Modal>
    );
};

export default ClickDetailsModal;