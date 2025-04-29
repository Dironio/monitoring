import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { ElementStat } from './interactionTypes';

const { Text } = Typography;

interface ElementStatsTableProps {
    data: ElementStat[];
    onRowClick: (elementType: string) => void;
}

const ElementStatsTable: React.FC<ElementStatsTableProps> = ({ data, onRowClick }) => {
    const columns = [
        {
            title: 'Тип элемента',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={getElementColor(type)}>{type}</Tag>
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
                        backgroundColor: getEngagementColor(engagement),
                        height: 20,
                        borderRadius: 4
                    }} />
                    <Text>{engagement}/100</Text>
                </div>
            )
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: ElementStat) => (
                <a onClick={() => onRowClick(record.type)}>Подробнее</a>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="type"
            pagination={{ pageSize: 10 }}
            size="small"
            onRow={(record: ElementStat) => ({
                onClick: () => onRowClick(record.type)
            })}
        />
    );
};

function getElementColor(type: string): string {
    const colors: Record<string, string> = {
        BUTTON: 'green',
        LINK: 'orange',
        INPUT: 'purple',
        IMG: 'blue',
        DIV: 'cyan'
    };
    return colors[type] || 'geekblue';
}

function getEngagementColor(value: number): string {
    if (value > 70) return '#52c41a';
    if (value > 40) return '#faad14';
    return '#ff4d4f';
}

export default ElementStatsTable;