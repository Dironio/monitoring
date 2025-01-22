// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import axios from 'axios';
// import { AlertCircle } from 'lucide-react';
// import './ScrollHeatmap.css';
// import { useSiteContext } from '../../../../utils/SiteContext';

// interface ScrollPoint {
//     event_data: {
//         scrollTop: number;
//         scrollPercentage: number;
//         duration: number;
//     };
//     scroll_count: number;
// }

// interface ScrollGroup {
//     startPercentage: number;
//     endPercentage: number;
//     totalScrolls: number;
//     points: Array<any>; // тип можно уточнить в зависимости от ваших данных
// }

// interface HeatmapResponse {
//     points: ScrollPoint[];
//     maxCount: number | null;
// }

// const ScrollHeatmap: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [debug, setDebug] = useState(false);
//     const [overlayHeight, setOverlayHeight] = useState(0);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const [maxCount, setMaxCount] = useState<number>(0);

//     const handleIframeLoad = useCallback(() => {
//         if (iframeRef.current) {
//             const height = iframeRef.current.contentWindow?.document.documentElement.scrollHeight || 0;
//             setOverlayHeight(height);
//         }
//     }, []);

//     // const getHeatColor = (scrollCount: number, maxCount: number) => {
//     //     const ratio = scrollCount / maxCount;
//     //     const hue = 240 - (ratio * 240);
//     //     const saturation = 80 + (ratio * 20);
//     //     const lightness = 50;
//     //     return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
//     // };

//     const fetchHeatmapData = async () => {
//         if (!selectedSite || !selectedPage) {
//             setError('Пожалуйста, выберите сайт и страницу');
//             return;
//         }

//         try {
//             setLoading(true);
//             setError(null);

//             const url = `${process.env.REACT_APP_API_URL}/events/scroll-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;
//             const response = await axios.get<HeatmapResponse>(url, {
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (response.data.points && Array.isArray(response.data.points)) {
//                 setHeatmapData(response.data);
//             } else {
//                 setError('Некорректный формат данных');
//             }
//         } catch (err) {
//             console.error('Ошибка при получении данных:', err);
//             setError('Не удалось загрузить данные тепловой карты');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const createGradientStops = () => {
//         return `
//             rgba(255, 0, 0, 0.8) 0%,    // красный сверху
//             rgba(255, 255, 0, 0.6) 25%, // желтый
//             rgba(0, 255, 0, 0.5) 50%,   // зеленый
//             rgba(0, 255, 255, 0.4) 75%, // голубой
//             rgba(0, 0, 255, 0.3) 100%   // синий снизу
//         `;
//     };


//     const getGradientColor = (percentage: number) => {
//         // От красного (сверху) до синего (снизу)
//         if (percentage <= 20) return "255, 0, 0"; // красный
//         if (percentage <= 40) return "255, 165, 0"; // оранжевый
//         if (percentage <= 60) return "0, 255, 0"; // зеленый
//         if (percentage <= 80) return "0, 255, 255"; // голубой
//         return "0, 0, 255"; // синий
//     };

//     // const getColorIntensity = (count: number) => {
//     //     if (!heatmapData?.maxCount) return 0;
//     //     return count / heatmapData.maxCount;
//     // };

//     const aggregatedData = useMemo(() => {
//         const segments = 100;
//         const segmentSize = 100 / segments;
//         const aggregatedData = new Array(segments).fill(0).map((_, index) => ({
//             startPercent: index * segmentSize,
//             endPercent: (index + 1) * segmentSize,
//             count: 0
//         }));

//         if (heatmapData?.points) {
//             heatmapData.points.forEach((point: ScrollPoint) => {
//                 const segment = Math.floor(point.event_data.scrollPercentage / segmentSize);
//                 if (segment >= 0 && segment < segments) {
//                     aggregatedData[segment].count += point.scroll_count;
//                 }
//             });
//         }

//         return aggregatedData;
//     }, [heatmapData]);

//     const getHeatMapColor = (value: number) => {
//         // value от 0 до 1
//         // Определяем градиент от синего (мало скроллов) к красному (много скроллов)
//         const blue = [0, 0, 255];    // RGB для синего
//         const green = [0, 255, 0];   // RGB для зеленого
//         const red = [255, 0, 0];     // RGB для красного

//         let rgb;

//         if (value <= 0.5) {
//             // От синего к зеленому
//             const percent = value * 2;
//             rgb = blue.map((start, i) =>
//                 Math.round(start + (green[i] - start) * percent)
//             );
//         } else {
//             // От зеленого к красному
//             const percent = (value - 0.5) * 2;
//             rgb = green.map((start, i) =>
//                 Math.round(start + (red[i] - start) * percent)
//             );
//         }

//         return rgb.join(', ');
//     }

//     const groupScrolls = (points: any[], groupSize: number = 5) => {
//         // Группируем по процентным диапазонам (например, по 5%)
//         const groups: { [key: string]: ScrollGroup } = {};

//         points.forEach(point => {
//             if (point.event_data.scrollPercentage === null) return;

//             // Определяем группу для текущего процента
//             const groupIndex = Math.floor(point.event_data.scrollPercentage / groupSize);
//             const groupKey = `group_${groupIndex}`;

//             if (!groups[groupKey]) {
//                 groups[groupKey] = {
//                     startPercentage: groupIndex * groupSize,
//                     endPercentage: (groupIndex + 1) * groupSize,
//                     totalScrolls: 0,
//                     points: []
//                 };
//             }

//             groups[groupKey].totalScrolls += point.scroll_count;
//             groups[groupKey].points.push(point);
//         });

//         return Object.values(groups);
//     };

//     useEffect(() => {
//         if (selectedSite && selectedPage) {
//             fetchHeatmapData();
//         }
//     }, [selectedSite, selectedPage]);

//     return (
//         <div className="heatmap-container" ref={containerRef}>
//             <div className="heatmap-content">
//                 <div className="header-section">
//                     <div className="controls-container">
//                         <h1 className="main-title">Карта скроллов</h1>
//                         <div className="header-buttons">
//                             <button
//                                 onClick={fetchHeatmapData}
//                                 disabled={loading || !selectedSite || !selectedPage}
//                                 className="build-button"
//                             >
//                                 {loading ? 'Загрузка...' : 'Построить тепловую карту'}
//                             </button>
//                             <button
//                                 onClick={() => setDebug(!debug)}
//                                 className="debug-button"
//                             >
//                                 {debug ? 'Скрыть отладку' : 'Показать отладку'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {error && (
//                     <div className="error-container">
//                         <AlertCircle className="error-icon" />
//                         {error}
//                     </div>
//                 )}

//                 {debug && heatmapData && (
//                     <div className="debug-info">
//                         <h3>Отладочная информация:</h3>
//                         <pre>{JSON.stringify(heatmapData, null, 2)}</pre>
//                     </div>
//                 )}

//                 {selectedSite && selectedPage ? (
//                     <div className="visualization-container">
//                         <iframe
//                             ref={iframeRef}
//                             src={selectedPage.value}
//                             className="page-preview"
//                             onLoad={handleIframeLoad}
//                             title="Page Preview"
//                         />

//                         {heatmapData && heatmapData.points && heatmapData.points.length > 0 && (
//                             <div
//                                 className="heatmap-overlay"
//                                 style={{ height: `${overlayHeight}px` }}
//                             >
//                                 {(() => {
//                                     const validPoints = heatmapData.points.filter(point =>
//                                         point &&
//                                         point.scroll_count != null &&
//                                         point.event_data &&
//                                         point.event_data.scrollPercentage != null
//                                     );

//                                     if (validPoints.length === 0) {
//                                         return (
//                                             <div className="no-scroll-message">
//                                                 На данной странице нет скроллов или страница не скроллится
//                                             </div>
//                                         );
//                                     }

//                                     // Группируем скроллы
//                                     const scrollGroups = groupScrolls(validPoints);
//                                     const maxGroupScrolls = Math.max(...scrollGroups.map(group => group.totalScrolls));

//                                     return scrollGroups.map((group, index) => {
//                                         const intensity = maxGroupScrolls > 0 ? group.totalScrolls / maxGroupScrolls : 0;
//                                         const color = getHeatMapColor(intensity);

//                                         return (
//                                             <div
//                                                 key={index}
//                                                 className="heatmap-band"
//                                                 style={{
//                                                     top: `${group.startPercentage}%`,
//                                                     right: 0,
//                                                     width: '30px',
//                                                     height: `${group.endPercentage - group.startPercentage}%`,
//                                                     background: `rgba(${color}, 0.7)`,
//                                                     transition: 'all 0.3s ease'
//                                                 }}
//                                                 title={`Диапазон: ${group.startPercentage}% - ${group.endPercentage}%
// Количество скроллов: ${group.totalScrolls}
// Максимум скроллов в группе: ${maxGroupScrolls}
// Интенсивность: ${(intensity * 100).toFixed(1)}%`}
//                                             />
//                                         );
//                                     });
//                                 })()}
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="no-selection-message">
//                         Выберите сайт и страницу для построения тепловой карты
//                     </div>
//                 )}
//             </div>

//             <div className="legend-container">
//                 <div className="legend-content">
//                     {heatmapData && heatmapData.points ? (
//                         <>
//                             {heatmapData.points.some(point => point.event_data.scrollPercentage !== null) ? (
//                                 <>
//                                     <div className="legend-gradient">
//                                         <div className="legend-color" />
//                                         <div className="legend-labels">
//                                             <span>Макс: {heatmapData.maxCount} скроллов (красный)</span>
//                                             <span>Средне (зеленый)</span>
//                                             <span>Мин: 0 скроллов (синий)</span>
//                                         </div>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="legend-no-scroll">
//                                     Страница не имеет возможности скролла или скроллы отсутствуют
//                                 </div>
//                             )}
//                         </>
//                     ) : null}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ScrollHeatmap;






import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import './ScrollHeatmap.css';
import { useSiteContext } from '../../../../utils/SiteContext';

interface ScrollGroup {
    percentageGroup: number;
    unique_visits: number;
    total_views: number;
    total_duration: number;
    intensity: number;
}

interface HeatmapResponse {
    groups: ScrollGroup[];
    maxDuration: number;
    totalDuration: number;
}


//фиксануть отображение времени
const ScrollHeatmap: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState(false);
    const [overlayHeight, setOverlayHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleIframeLoad = useCallback(() => {
        if (iframeRef.current) {
            const height = iframeRef.current.contentWindow?.document.documentElement.scrollHeight || 0;
            setOverlayHeight(height);
        }
    }, []);

    const formatDuration = (milliseconds: number): string => {
        if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) return '0с';

        const ms = Number(milliseconds);

        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);

        if (minutes > 0) {
            const remainingSeconds = seconds % 60;
            return `${minutes}м ${remainingSeconds > 0 ? remainingSeconds + 'с' : ''}`;
        }

        return `${seconds}с`;
    };

    const getHeatMapColor = (intensity: number): string => {
        const blue = [0, 0, 255];
        const green = [0, 255, 0];
        const red = [255, 0, 0];

        let rgb;

        if (intensity <= 0.5) {
            const percent = intensity * 2;
            rgb = blue.map((start, i) =>
                Math.round(start + (green[i] - start) * percent)
            );
        } else {
            const percent = (intensity - 0.5) * 2;
            rgb = green.map((start, i) =>
                Math.round(start + (red[i] - start) * percent)
            );
        }

        return rgb.join(', ');
    };

    const fetchHeatmapData = async () => {
        if (!selectedSite || !selectedPage) {
            setError('Пожалуйста, выберите сайт и страницу');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const url = `${process.env.REACT_APP_API_URL}/events/scroll-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;
            const response = await axios.get<HeatmapResponse>(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data)

            if (response.data.groups && Array.isArray(response.data.groups)) {
                setHeatmapData(response.data);
            } else {
                setError('Некорректный формат данных');
            }
        } catch (err) {
            console.error('Ошибка при получении данных:', err);
            setError('Не удалось загрузить данные тепловой карты');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (heatmapData?.groups) {
            console.log('Received heatmap data:', heatmapData.groups.map(group => ({
                percentage: group.percentageGroup,
                rawDuration: group.total_duration,
                formatted: formatDuration(group.total_duration)
            })));
        }
    }, [heatmapData]);

    return (
        <div className="heatmap-container" ref={containerRef}>
            <div className="heatmap-content">
                <div className="header-section">
                    <div className="controls-container">
                        <h1 className="main-title">Карта скроллов</h1>
                        <div className="header-buttons">
                            <button
                                onClick={fetchHeatmapData}
                                disabled={loading || !selectedSite || !selectedPage}
                                className="build-button"
                            >
                                {loading ? 'Загрузка...' : 'Построить тепловую карту'}
                            </button>
                            <button
                                onClick={() => setDebug(!debug)}
                                className="debug-button"
                            >
                                {debug ? 'Скрыть отладку' : 'Показать отладку'}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-container">
                        <AlertCircle className="error-icon" />
                        {error}
                    </div>
                )}

                {debug && heatmapData && (
                    <div className="debug-info">
                        <h3>Отладочная информация:</h3>
                        <pre>{JSON.stringify(heatmapData, null, 2)}</pre>
                    </div>
                )}

                {selectedSite && selectedPage ? (
                    <div className="visualization-container">
                        <iframe
                            ref={iframeRef}
                            src={selectedPage.value}
                            className="page-preview"
                            onLoad={handleIframeLoad}
                            title="Page Preview"
                        />

                        {heatmapData && heatmapData.groups && (
                            <div
                                className="heatmap-overlay"
                                style={{ height: `${overlayHeight}px` }}
                            >
                                {heatmapData.groups
                                    .sort((a, b) => a.percentageGroup - b.percentageGroup)
                                    .map((group: ScrollGroup, index: number) => {
                                        const color = getHeatMapColor(group.intensity);
                                        const duration = Number(group.total_duration);

                                        return (
                                            <div
                                                key={index}
                                                className="heatmap-band"
                                                style={{
                                                    top: `${group.percentageGroup}%`,
                                                    right: 0,
                                                    width: '30px',
                                                    height: '5%',
                                                    background: `rgba(${color}, 0.7)`,
                                                    transition: 'all 0.3s ease'
                                                }}
                                                title={`Область: ${group.percentageGroup}% - ${group.percentageGroup + 5}%
Время просмотра: ${formatDuration(duration)}
Уникальных посещений: ${group.unique_visits}
Всего просмотров: ${group.total_views}
Интенсивность: ${(group.intensity * 100).toFixed(1)}%`}
                                            />
                                        );
                                    })}

                                <div className="legend-container">
                                    <div className="legend-content">
                                        <div className="legend-gradient">
                                            <div className="legend-color" />
                                            <div className="legend-labels">
                                                <span>Долгое время просмотра </span>
                                                <span>Среднее время </span>
                                                <span>Короткое время </span>
                                            </div>
                                        </div>
                                        <div className="legend-info">
                                            <span>Группировка по 5%</span>
                                            {heatmapData.maxDuration && (
                                                <>
                                                    <span>Макс. время: {formatDuration(heatmapData.maxDuration)}</span>
                                                    <span>Общее время: {formatDuration(heatmapData.totalDuration)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="no-selection-message">
                        Выберите сайт и страницу для построения тепловой карты
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScrollHeatmap;
