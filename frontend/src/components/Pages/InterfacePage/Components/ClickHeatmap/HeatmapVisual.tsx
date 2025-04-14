import React, { useCallback, useEffect, useRef } from 'react';
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

interface HeatmapVisualizationProps {
    data: ClickHeatmapData[];
    containerWidth: number;
    containerHeight: number;
    isVisible: boolean;
}








// export interface HeatmapPoint {
//     x: number;
//     y: number;
//     value: number; // heatmap.js использует 'value'
// }

// // Для данных с бэка
// interface BackendHeatmapPoint {
//     x: number;
//     y: number;
//     count: number;
// }

// export interface HeatmapResponse {
//     points: BackendHeatmapPoint[];
//     maxCount: number;
// }




// const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({
//     data,
//     containerWidth,
//     containerHeight,
//     isVisible
// }) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const heatmapInstanceRef = useRef<any>(null);

//     useEffect(() => {
//         if (!containerRef.current || !isVisible) return;

//         // Очищаем предыдущий экземпляр
//         if (heatmapInstanceRef.current) {
//             heatmapInstanceRef.current._renderer.canvas.remove();
//         }

//         // Инициализируем тепловую карту
//         heatmapInstanceRef.current = h337.create({
//             container: containerRef.current,
//             radius: 30,  // Уменьшил с 50 до 30
//             maxOpacity: 0.7,
//             minOpacity: 0.1,
//             blur: 0.9,  // Увеличил размытие
//             gradient: {
//                 '0.1': 'blue',
//                 '0.5': 'cyan',
//                 '0.7': 'lime',
//                 '0.8': 'yellow',
//                 '1.0': 'red'
//             }
//         });

//         if (data.length > 0) {
//             const maxX = Math.max(...data.map(p => p.eventData.x));
//             const maxY = Math.max(...data.map(p => p.eventData.y));

//             const points = data.map(item => ({
//                 x: Math.floor((item.eventData.x / maxX) * containerWidth),
//                 y: Math.floor((item.eventData.y / maxY) * containerHeight),
//                 value: item.clickCount
//             }));

//             const maxValue = Math.max(...points.map(p => p.value));
//             heatmapInstanceRef.current.setData({
//                 max: maxValue,
//                 data: points
//             });
//         }

//         return () => {
//             if (heatmapInstanceRef.current) {
//                 heatmapInstanceRef.current._renderer.canvas.remove();
//             }
//         };
//     }, [data, containerWidth, containerHeight, isVisible]);

//     return (
//         <>
//             <div className={`heatmap-overlay ${isVisible ? 'heatmap-overlay--visible' : ''}`} />
//             <div 
//                 ref={containerRef}
//                 className={`heatmap-canvas-container ${isVisible ? 'heatmap-canvas-container--visible' : ''}`}
//             />
//             <div className={`heatmap-legend ${isVisible ? 'heatmap-legend--visible' : ''}`}>
//                 <div className="legend-gradient" />
//                 <div className="legend-labels">
//                     <span>Меньше</span>
//                     <span>Больше</span>
//                 </div>
//             </div>
//         </>
//     );
// };



// interface HeatmapVisualizationProps {
//     data: HeatmapPoint[];
//     containerWidth: number;
//     containerHeight: number;
//     isVisible: boolean;
// }

// const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({
//     data,
//     containerWidth,
//     containerHeight,
//     isVisible
// }) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const heatmapInstanceRef = useRef<any>(null);

//     const transformPoints = useCallback(() => {
//         if (!data.length || !containerRef.current) return [];

//         // Получаем iframe и его размеры
//         const iframe = containerRef.current.parentElement?.querySelector('iframe');
//         if (!iframe) return data; // Если нет iframe, возвращаем данные как есть

//         const scaleX = containerWidth / iframe.clientWidth;
//         const scaleY = containerHeight / iframe.clientHeight;

//         return data.map(point => ({
//             x: Math.floor(point.x * scaleX),
//             y: Math.floor(point.y * scaleY),
//             value: point.value
//         }));
//     }, [data, containerWidth, containerHeight]);

//     useEffect(() => {
//         if (!containerRef.current || !isVisible) return;

//         // Инициализация heatmap
//         heatmapInstanceRef.current = h337.create({
//             container: containerRef.current,
//             radius: 40,
//             maxOpacity: 0.8,
//             minOpacity: 0.2,
//             blur: 0.9,
//             gradient: {
//                 '0.1': 'blue',
//                 '0.5': 'cyan',
//                 '0.7': 'lime',
//                 '0.8': 'yellow',
//                 '1.0': 'red'
//             }
//         });

//         const updateHeatmap = () => {
//             if (heatmapInstanceRef.current) {
//                 const points = transformPoints();
//                 if (points.length > 0) {
//                     heatmapInstanceRef.current.setData({
//                         max: Math.max(...points.map(p => p.value)),
//                         data: points
//                     });
//                 }
//             }
//         };

//         updateHeatmap();

//         // Обновляем при изменении размеров
//         const resizeObserver = new ResizeObserver(updateHeatmap);
//         if (containerRef.current.parentElement) {
//             resizeObserver.observe(containerRef.current.parentElement);
//         }

//         return () => {
//             resizeObserver.disconnect();
//             if (heatmapInstanceRef.current) {
//                 heatmapInstanceRef.current._renderer.canvas.remove();
//             }
//         };
//     }, [isVisible, transformPoints]);

//     if (!isVisible) return null;

//     return (
//         <div
//             ref={containerRef}
//             style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 pointerEvents: 'none'
//             }}
//         />
//     );
// };














const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({
    data,
    containerWidth,
    containerHeight,
    isVisible
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heatmapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current || !isVisible) return;

        // Очищаем предыдущий экземпляр
        if (heatmapInstanceRef.current) {
            heatmapInstanceRef.current._renderer.canvas.remove();
        }

        // Инициализируем тепловую карту
        heatmapInstanceRef.current = h337.create({
            container: containerRef.current,
            radius: 40,
            maxOpacity: 0.9,
            minOpacity: 0.01,
            blur: 0.9,
            gradient: {
                '0.1': 'blue',
                '0.5': 'cyan',
                '0.7': 'lime',
                '0.8': 'yellow',
                '1.0': 'red'
            }
        });

        if (data.length > 0) {
            const maxX = Math.max(...data.map(p => p.eventData.x));
            const maxY = Math.max(...data.map(p => p.eventData.y));

            const points = data.map(item => ({
                x: Math.floor((item.eventData.x / 1920) * containerWidth),
                y: Math.floor((item.eventData.y / 950) * containerHeight),
                value: item.clickCount
            }));

            const maxValue = Math.max(...points.map(p => p.value));
            heatmapInstanceRef.current.setData({
                max: maxValue,
                data: points
            });
        }

        return () => {
            if (heatmapInstanceRef.current) {
                heatmapInstanceRef.current._renderer.canvas.remove();
            }
        };
    }, [data, containerWidth, containerHeight, isVisible]);

    return (
        <>
            <div className={`heatmap-overlay ${isVisible ? 'heatmap-overlay--visible' : ''}`} />
            <div
                ref={containerRef}
                className={`heatmap-canvas-container ${isVisible ? 'heatmap-canvas-container--visible' : ''}`}
            />
            {/* <div className={`heatmap-legend ${isVisible ? 'heatmap-legend--visible' : ''}`}>
                <div className="legend-gradient" />
                <div className="legend-labels">
                    <span>Меньше</span>
                    <span>Больше</span>
                </div>
            </div> */}
        </>
    );
};


export default HeatmapVisualization;