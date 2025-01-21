import React, { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

interface HeatmapDataPoint {
    x: number;
    y: number;
    count: number;
}

interface HeatmapProps {
    data: HeatmapDataPoint[];
    maxCount: number;
}

export interface ClickHeatmapData {
    eventData: {
        x: number;
        y: number;
    };
    clickCount: number;
}

// const HeatmapVisualization: React.FC<{ data: ClickHeatmapData[] }> = ({ data }) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const heatmapInstanceRef = useRef<any>(null);
//     useEffect(() => {
//         if (!containerRef.current) return;

//         const container = containerRef.current;
//         console.log('Container size:', container.getBoundingClientRect());

//         // Очищаем предыдущий экземпляр
//         if (heatmapInstanceRef.current) {
//             container.innerHTML = '';
//         }

//         // Создаем новый экземпляр
//         heatmapInstanceRef.current = h337.create({
//             container: container,
//             radius: 30,
//             maxOpacity: 0.6,
//             minOpacity: 0,
//             blur: 0.75,
//             gradient: {
//                 '.5': 'blue',
//                 '.8': 'red',
//                 '.95': 'white'
//             }
//         });

//         const containerRect = container.getBoundingClientRect();

//         // Находим максимальные координаты
//         const maxX = Math.max(...data.map(point => point.eventData.x));
//         const maxY = Math.max(...data.map(point => point.eventData.y));

//         // Коэффициенты масштабирования
//         const scaleX = containerRect.width / maxX;
//         const scaleY = containerRect.height / maxY;

//         const heatmapData = {
//             max: Math.max(...data.map(point => point.clickCount)),
//             min: 0,
//             data: data.map(point => ({
//                 x: Math.round(point.eventData.x * scaleX),
//                 y: Math.round(point.eventData.y * scaleY),
//                 value: point.clickCount
//             }))
//         };

//         console.log('Scaled heatmap data:', heatmapData);
//         heatmapInstanceRef.current.setData(heatmapData);

//     }, [data]);

//     return (
//         <div
//             ref={containerRef}
//             style={{
//                 width: '100%',
//                 height: '100%',
//                 position: 'absolute',
//                 backgroundColor: 'rgba(0, 0, 0, 0.1)',
//                 border: '1px solid #ccc',
//                 borderRadius: '4px'
//             }}
//         />
//     );
// };




const HeatmapVisualization: React.FC<{ data: ClickHeatmapData[] }> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heatmapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Очищаем предыдущий экземпляр
        if (heatmapInstanceRef.current) {
            containerRef.current.innerHTML = '';
        }

        const container = containerRef.current;
        const bounds = container.getBoundingClientRect();

        heatmapInstanceRef.current = h337.create({
            container: container,
            radius: 20,
            maxOpacity: 0.6,
            minOpacity: 0.1,
            blur: 0.75,
            gradient: {
                '0.4': 'blue',
                '0.6': 'cyan',
                '0.7': 'lime',
                '0.8': 'yellow',
                '1.0': 'red'
            }
        });

        // Преобразуем данные в формат тепловой карты
        const points = data.map(item => ({
            x: item.eventData.x,
            y: item.eventData.y,
            value: item.clickCount
        }));

        // Находим максимальное значение для нормализации
        const maxValue = Math.max(...points.map(p => p.value));

        heatmapInstanceRef.current.setData({
            max: maxValue,
            data: points
        });

        // Добавляем точки для визуальной проверки
        const dotContainer = document.createElement('div');
        dotContainer.style.position = 'absolute';
        dotContainer.style.top = '0';
        dotContainer.style.left = '0';
        dotContainer.style.width = '100%';
        dotContainer.style.height = '100%';
        dotContainer.style.pointerEvents = 'none';

        points.forEach(point => {
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.left = `${point.x}px`;
            dot.style.top = `${point.y}px`;
            dot.style.width = '4px';
            dot.style.height = '4px';
            dot.style.backgroundColor = 'red';
            dot.style.borderRadius = '50%';
            dot.style.pointerEvents = 'none';
            dotContainer.appendChild(dot);
        });

        container.appendChild(dotContainer);

    }, [data]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'transparent'
            }}
        />
    );
};

export default HeatmapVisualization;