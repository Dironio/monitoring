import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { UMAPPoint } from './UmapTypes';


ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// interface UmapChartProps {
//     data: UMAPPoint[];
//     colorBy: 'eventType' | 'time' | 'page';
// }

interface UmapChartProps {
    data: UMAPPoint[];
    colorBy: 'eventType' | 'time' | 'page' | 'segment';
    userSegments: Record<string, string>;
    onPointClick?: (point: UMAPPoint) => void;
}

const SEGMENT_COLORS: Record<string, string> = {
    'новичок': '#6366f1',
    'заинтересованный': '#10b981',
    'вовлеченный': '#f59e0b',
    'отказник': '#ef4444',
    'проходимец': '#94a3b8',
    'неизвестно': '#64748b'
};

export const UmapChart = ({ data, colorBy, userSegments, onPointClick }: UmapChartProps) => {
    const getBackgroundColor = (point: UMAPPoint) => {
        switch (colorBy) {
            case 'eventType': return point.eventType === 'scroll' ? '#6366f1' : '#10b981';
            case 'time':
                const hour = new Date(point.timestamp).getHours();
                return `hsl(${hour * 15}, 70%, 50%)`;
            case 'page': return point.pageUrl.includes('similarity') ? '#8b5cf6' : '#ec4899';
            case 'segment': return SEGMENT_COLORS[point.userSegment] || '#64748b';
            default: return '#6366f1';
        }
    };

    const chartData = {
        datasets: [{
            label: 'User Events',
            data: data.map(point => ({
                x: point.x,
                y: point.y,
                pointData: point // Все остальные данные передаем в отдельном поле
            })),
            backgroundColor: data.map(point => getBackgroundColor(point)),
            pointRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.8)'
        }]
    };

    const options = {
        onClick: (event: any, elements: any[]) => {
            if (elements.length > 0 && onPointClick) {
                const pointIndex = elements[0].index;
                onPointClick(data[pointIndex]);
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'UMAP Dimension 1' } },
            y: { title: { display: true, text: 'UMAP Dimension 2' } }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const point = context.raw.pointData as UMAPPoint;
                        return [
                            `Событие: ${point.label}`,
                            `Время: ${new Date(point.timestamp).toLocaleString()}`,
                            `Тип: ${point.eventType === 'scroll' ? 'Прокрутка' : 'Клик'}`,
                            `Сегмент: ${point.userSegment}`,
                            `Координаты: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`
                        ];
                    }
                }
            }
        }
    };

    return <Scatter data={chartData} options={options} />;
};