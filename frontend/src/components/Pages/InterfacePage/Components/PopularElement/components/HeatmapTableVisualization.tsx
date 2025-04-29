import React from 'react';
import { Heatmap } from '@ant-design/plots';
import { Card, Typography } from 'antd';
import { HeatmapCell } from './interactionTypes';

const { Text } = Typography;

interface HeatmapTableVisualizationProps {
    data: HeatmapCell[];
    onCellClick: (cell: HeatmapCell) => void;
    pageUrl?: string;
}

const HeatmapTableVisualization: React.FC<HeatmapTableVisualizationProps> = ({
    data,
    onCellClick,
    pageUrl
}) => {
    if (!data || data.length === 0) {
        return (
            <Card title="Визуализация кликов">
                <Text>Нет данных для отображения</Text>
            </Card>
        );
    }

    const config = {
        data: data.map(item => ({
            x: item.x,
            y: item.y,
            value: item.count,
            elements: item.elements.join(', '),
            duration: Math.round(item.avg_duration)
        })),
        xField: 'x',
        yField: 'y',
        colorField: 'value',
        shape: 'circle',
        sizeRatio: 0.5,
        color: ['#f0f0f0', '#ffd8bf', '#ffbb96', '#ff9c6e', '#ff7a45', '#fa541c', '#d4380d', '#ad2102'],
        tooltip: {
            fields: ['x', 'y', 'value', 'elements', 'duration'],
            formatter: (datum: any) => ({
                name: `Координаты: ${datum.x}, ${datum.y}`,
                value: `Кликов: ${datum.value}\nЭлементы: ${datum.elements}\nСр. длительность: ${datum.duration}мс`
            })
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
        onEvent: (record: any, event: any) => {
            if (event.type === 'click') {
                const cell = data.find(d => d.x === record.x && d.y === record.y);
                if (cell) onCellClick(cell);
            }
        }
    };

    return (
        <Card
            title="Визуализация кликов"
            style={{ marginBottom: 24 }}
        >
            <div style={{ height: 500, position: 'relative' }}>
                {pageUrl && (
                    <div
                        className="page-screenshot"
                        style={{
                            backgroundImage: `url(/api/screenshot?url=${encodeURIComponent(pageUrl)})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0.3,
                            pointerEvents: 'none'
                        }}
                    />
                )}
                <Heatmap {...config} />
            </div>
        </Card>
    );
};

export default HeatmapTableVisualization;