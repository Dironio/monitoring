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











import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useSiteContext } from '../../../../utils/SiteContext';
import './ScrollHeatmap.css';

interface ScrollDataPoint {
    scroll_percentage: number;
    total_duration: number;
    view_count: number;
    intensity: number;
}

interface HeatmapResponse {
    points: ScrollDataPoint[];
    maxDuration: number;
    totalDuration: number;
}

const ScrollHeatmap: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [data, setData] = useState<HeatmapResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState(800);

    const fetchData = async () => {
        if (!selectedSite || !selectedPage) {
            setError('Select site and page');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<HeatmapResponse>(
                `${process.env.REACT_APP_API_URL}/events/scroll-heatmap`,
                {
                    params: {
                        web_id: selectedSite.value,
                        page_url: selectedPage.value
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );

            setData(response.data);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleLoad = () => {
            if (iframeRef.current) {
                try {
                    const doc = iframeRef.current.contentDocument;
                    if (doc) {
                        const height = Math.max(
                            doc.body.scrollHeight,
                            doc.documentElement.scrollHeight
                        );
                        setIframeHeight(height);
                    }
                } catch (e) {
                    console.warn("Can't access iframe document:", e);
                    setIframeHeight(800);
                }
            }
        };

        const iframe = iframeRef.current;
        if (iframe) {
            iframe.addEventListener('load', handleLoad);
        }

        return () => {
            if (iframe) {
                iframe.removeEventListener('load', handleLoad);
            }
        };
    }, []);

    const renderHeatmap = () => {
        if (!data || !data.points.length) return null;

        return data.points.map((point, i) => {
            const top = `${point.scroll_percentage}%`;
            const height = '5%';
            const opacity = Math.min(point.intensity * 2, 0.8);
            const color = `rgba(255, 0, 0, ${opacity})`;

            return (
                <div
                    key={i}
                    className="heatmap-band"
                    style={{
                        position: 'absolute',
                        top,
                        height,
                        left: 0,
                        right: 0,
                        backgroundColor: color,
                        pointerEvents: 'none'
                    }}
                    title={`Scroll: ${point.scroll_percentage}-${point.scroll_percentage + 5}%
Views: ${point.view_count}
Duration: ${Math.round(point.total_duration / 1000)}s`}
                />
            );
        });
    };

    return (
        <div className="scroll-heatmap-container">
            <div className="controls">
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="fetch-button"
                >
                    {loading ? 'Loading...' : 'Generate Heatmap'}
                </button>
            </div>

            {error && (
                <div className="error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className="iframe-container">
                <iframe
                    ref={iframeRef}
                    src={selectedPage?.value}
                    style={{ height: `${iframeHeight}px` }}
                    className="heatmap-iframe"
                    sandbox="allow-same-origin"
                />
                <div className="heatmap-overlay">
                    {renderHeatmap()}
                </div>
            </div>

            {data && (
                <div className="legend">
                    <div className="legend-gradient">
                        <div className="gradient-bar" />
                        <div className="labels">
                            <span>Low engagement</span>
                            <span>High engagement</span>
                        </div>
                    </div>
                    <div className="stats">
                        <div>Max duration: {Math.round(data.maxDuration / 1000)}s</div>
                        <div>Total duration: {Math.round(data.totalDuration / 1000)}s</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScrollHeatmap;