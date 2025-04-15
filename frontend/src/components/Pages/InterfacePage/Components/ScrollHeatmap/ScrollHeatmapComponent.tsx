// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { AlertCircle } from 'lucide-react';
// import axios from 'axios';
// import './ScrollHeatmap.css';
// import { useSiteContext } from '../../../../utils/SiteContext';

// interface ScrollGroup {
//     percentageGroup: number;
//     unique_visits: number;
//     total_views: number;
//     total_duration: number;
//     intensity: number;
// }

// interface HeatmapResponse {
//     groups: ScrollGroup[];
//     maxDuration: number;
//     totalDuration: number;
// }


// //фиксануть отображение времени
// const ScrollHeatmap: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [debug, setDebug] = useState(false);
//     const [overlayHeight, setOverlayHeight] = useState(0);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const iframeRef = useRef<HTMLIFrameElement>(null);

//     const handleIframeLoad = useCallback(() => {
//         if (iframeRef.current) {
//             const height = iframeRef.current.contentWindow?.document.documentElement.scrollHeight || 0;
//             setOverlayHeight(height);
//         }
//     }, []);

//     const formatDuration = (milliseconds: number): string => {
//         if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) return '0с';

//         const ms = Number(milliseconds);

//         const seconds = Math.floor(ms / 1000);
//         const minutes = Math.floor(seconds / 60);

//         if (minutes > 0) {
//             const remainingSeconds = seconds % 60;
//             return `${minutes}м ${remainingSeconds > 0 ? remainingSeconds + 'с' : ''}`;
//         }

//         return `${seconds}с`;
//     };

//     const getHeatMapColor = (intensity: number): string => {
//         const blue = [0, 0, 255];
//         const green = [0, 255, 0];
//         const red = [255, 0, 0];

//         let rgb;

//         if (intensity <= 0.5) {
//             const percent = intensity * 2;
//             rgb = blue.map((start, i) =>
//                 Math.round(start + (green[i] - start) * percent)
//             );
//         } else {
//             const percent = (intensity - 0.5) * 2;
//             rgb = green.map((start, i) =>
//                 Math.round(start + (red[i] - start) * percent)
//             );
//         }

//         return rgb.join(', ');
//     };

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

//             console.log(response.data)

//             if (response.data.groups && Array.isArray(response.data.groups)) {
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

//     useEffect(() => {
//         if (heatmapData?.groups) {
//             console.log('Received heatmap data:', heatmapData.groups.map(group => ({
//                 percentage: group.percentageGroup,
//                 rawDuration: group.total_duration,
//                 formatted: formatDuration(group.total_duration)
//             })));
//         }
//     }, [heatmapData]);

//     return (
//         <div className="heatmap-container" ref={containerRef}>
//             <div className="heatmap-content">
//                 <div className="header-section">
//                     <div className="controls-container">
//                         {/* <h1 className="main-title">Карта скроллов</h1> */}
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

//                         {heatmapData && heatmapData.groups && (
//                             <div
//                                 className="heatmap-overlay"
//                                 style={{ height: `${overlayHeight}px` }}
//                             >
//                                 {heatmapData.groups
//                                     .sort((a, b) => a.percentageGroup - b.percentageGroup)
//                                     .map((group: ScrollGroup, index: number) => {
//                                         const color = getHeatMapColor(group.intensity);
//                                         const duration = Number(group.total_duration);

//                                         return (
//                                             <div
//                                                 key={index}
//                                                 className="heatmap-band"
//                                                 style={{
//                                                     top: `${group.percentageGroup}%`,
//                                                     right: 0,
//                                                     width: '30px',
//                                                     height: '5%',
//                                                     background: `rgba(${color}, 0.7)`,
//                                                     transition: 'all 0.3s ease'
//                                                 }}
//                                                 title={`Область: ${group.percentageGroup}% - ${group.percentageGroup + 5}%
//                                                         Время просмотра: ${formatDuration(duration)}
//                                                         Уникальных посещений: ${group.unique_visits}
//                                                         Всего просмотров: ${group.total_views}
//                                                         Интенсивность: ${(group.intensity * 100).toFixed(1)}%`}
//                                             />
//                                         );
//                                     })}

//                                 <div className="legend-container">
//                                     <div className="legend-content">
//                                         <div className="legend-gradient">
//                                             <div className="legend-color" />
//                                             <div className="legend-labels">
//                                                 <span>Долгое время просмотра </span>
//                                                 <span>Среднее время </span>
//                                                 <span>Короткое время </span>
//                                             </div>
//                                         </div>
//                                         <div className="legend-info">
//                                             <span>Группировка по 5%</span>
//                                             {heatmapData.maxDuration && (
//                                                 <>
//                                                     <span>Макс. время: {formatDuration(heatmapData.maxDuration)}</span>
//                                                     <span>Общее время: {formatDuration(heatmapData.totalDuration)}</span>
//                                                 </>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="no-selection-message">
//                         Выберите сайт и страницу для построения тепловой карты
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ScrollHeatmap;











// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useSiteContext } from '../../../../utils/SiteContext';
// import './ScrollHeatmap.css';

// interface ScrollGroup {
//     percentageGroup: number;
//     unique_visits: number;
//     total_views: number;
//     total_duration: number;
//     intensity: number;
// }

// interface HeatmapResponse {
//     groups: ScrollGroup[];
//     maxDuration: number;
//     totalDuration: number;
// }

// const ScrollHeatmap: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [debug, setDebug] = useState(false);
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const [overlayHeight, setOverlayHeight] = useState(600); // Default height

//     // For testing purposes - remove in production
//     const [showTestData, setShowTestData] = useState(false);
//     const testData: HeatmapResponse = {
//         groups: [
//             { percentageGroup: 10, intensity: 0.1, total_duration: 5000, total_views: 5, unique_visits: 3 },
//             { percentageGroup: 20, intensity: 0.3, total_duration: 15000, total_views: 12, unique_visits: 8 },
//             { percentageGroup: 30, intensity: 0.5, total_duration: 25000, total_views: 18, unique_visits: 10 },
//             { percentageGroup: 40, intensity: 0.7, total_duration: 35000, total_views: 22, unique_visits: 14 },
//             { percentageGroup: 50, intensity: 0.9, total_duration: 45000, total_views: 28, unique_visits: 20 }
//         ],
//         maxDuration: 45000,
//         totalDuration: 125000
//     };

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

//             if (response.data.groups && Array.isArray(response.data.groups)) {
//                 console.log('API response data:', response.data);
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

//     const handleIframeLoad = useCallback(() => {
//         try {
//             const iframe = iframeRef.current;
//             if (!iframe) return;

//             // Safety timeout to ensure iframe is fully loaded
//             setTimeout(() => {
//                 try {
//                     if (iframe.contentDocument) {
//                         const height = iframe.contentDocument.body.scrollHeight || 600;
//                         console.log('Iframe content height:', height);
//                         setOverlayHeight(height);
//                     } else {
//                         // Fallback
//                         setOverlayHeight(600);
//                     }
//                 } catch (e) {
//                     console.error('Cannot access iframe content:', e);
//                     setOverlayHeight(600);
//                 }
//             }, 500);
//         } catch (e) {
//             console.error('Error in iframe load handler:', e);
//         }
//     }, []);

//     const formatDuration = (ms: number): string => {
//         if (!ms || isNaN(ms)) return '0с';
//         const s = Math.floor(ms / 1000);
//         const m = Math.floor(s / 60);
//         return m > 0 ? `${m}м ${s % 60}с` : `${s}с`;
//     };

//     const getColorByIntensity = (intensity: number) => {
//         // Make colors more vivid for better visibility
//         if (intensity < 0.33) {
//             return '#0000FF'; // Blue
//         } else if (intensity < 0.66) {
//             return '#00FF00'; // Green
//         } else {
//             return '#FF0000'; // Red
//         }
//     };

//     // For debugging - apply test data
//     const applyTestData = () => {
//         setHeatmapData(testData);
//         setShowTestData(true);
//     };

//     // Render data based on currentData
//     const dataToDisplay = showTestData ? testData : heatmapData;

//     return (
//         <div className="heatmap-container">
//             <div className="controls">
//                 <button
//                     onClick={fetchHeatmapData}
//                     disabled={loading || !selectedSite || !selectedPage}
//                     className="build-button"
//                 >
//                     {loading ? 'Загрузка...' : 'Построить тепловую карту'}
//                 </button>
//                 <button
//                     onClick={applyTestData}
//                     className="build-button"
//                 >
//                     Тестовые данные
//                 </button>
//                 <button
//                     onClick={() => setDebug(!debug)}
//                     className="debug-button"
//                 >
//                     {debug ? 'Скрыть отладку' : 'Показать отладку'}
//                 </button>
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             {debug && (
//                 <div className="debug-panel">
//                     <h4>Отладочная информация:</h4>
//                     <div>Высота оверлея: {overlayHeight}px</div>
//                     <div>Данные карты: {dataToDisplay ? `Загружены (${dataToDisplay.groups.length} групп)` : 'Не загружены'}</div>
//                     {dataToDisplay && (
//                         <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
//                     )}
//                 </div>
//             )}

//             <div className="heatmap-wrapper">
//                 {selectedPage && (
//                     <iframe
//                         ref={iframeRef}
//                         src={selectedPage.value}
//                         className="page-frame"
//                         onLoad={handleIframeLoad}
//                         title="Page Preview"
//                     />
//                 )}

//                 {!selectedPage && (
//                     <div className="no-selection">
//                         Выберите сайт и страницу для построения тепловой карты
//                     </div>
//                 )}

//                 {dataToDisplay && dataToDisplay.groups && dataToDisplay.groups.length > 0 && (
//                     <div
//                         className="heatmap-overlay"
//                         style={{ height: `${overlayHeight}px` }}
//                     >
//                         {/* Explicitly styled bands for maximum visibility */}
//                         {dataToDisplay.groups
//                             .sort((a, b) => a.percentageGroup - b.percentageGroup)
//                             .map((group, i) => (
//                                 <div
//                                     key={i}
//                                     className="heatmap-band"
//                                     style={{
//                                         top: `${group.percentageGroup}%`,
//                                         right: '0',
//                                         backgroundColor: getColorByIntensity(group.intensity),
//                                         height: '5%',
//                                         minHeight: '10px',
//                                         width: '100%',
//                                         position: 'absolute',
//                                         border: '1px solid rgba(0,0,0,0.2)',
//                                         opacity: 0.7, // Make slightly transparent to see overlay
//                                         zIndex: 11
//                                     }}
//                                     title={`Позиция: ${group.percentageGroup}–${group.percentageGroup + 5}%
// Время: ${formatDuration(group.total_duration)}
// Просмотры: ${group.total_views}
// Посетители: ${group.unique_visits}`}
//                                 />
//                             ))}

//                         <div className="heatmap-legend">
//                             <div className="legend-gradient"></div>
//                             <div className="legend-labels">
//                                 <span>Короткое</span>
//                                 <span>Среднее</span>
//                                 <span>Долгое</span>
//                             </div>
//                             {dataToDisplay.maxDuration && (
//                                 <div className="legend-stats">
//                                     <span>Макс: {formatDuration(dataToDisplay.maxDuration)}</span>
//                                     <span>Всего: {formatDuration(dataToDisplay.totalDuration)}</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ScrollHeatmap;













import React, { useRef } from 'react';

interface ScrollHeatmapPoint {
    scroll_top_bucket: number;
    count: number;
}

interface Props {
    data: ScrollHeatmapPoint[];
    containerHeight: number;
    isVisible: boolean;
}

const ScrollHeatmapVisualization: React.FC<Props> = ({ data, containerHeight, isVisible }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <>
            <div className={`heatmap-overlay ${isVisible ? 'heatmap-overlay--visible' : ''}`} />
            <div
                ref={containerRef}
                className={`heatmap-canvas-container ${isVisible ? 'heatmap-canvas-container--visible' : ''}`}
            >
                {data.map((point, index) => {
                    const y = (point.scroll_top_bucket / 5000) * containerHeight; //мб поменять
                    const intensity = point.count / maxCount;

                    return (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                top: `${y}px`,
                                left: 0,
                                width: '100%',
                                height: '100px',
                                background: `rgba(${255 * (1 - intensity)}, 0, ${255 * intensity}, ${intensity * 0.7})`,
                                pointerEvents: 'none',
                            }}
                        />
                    );
                })}
            </div>
            <div className={`heatmap-legend ${isVisible ? 'heatmap-legend--visible' : ''}`}>
                <div className="legend-gradient" />
                <div className="legend-labels">
                    <span>Меньше</span>
                    <span>Больше</span>
                </div>
            </div>
        </>
    );
};

export default ScrollHeatmapVisualization;
