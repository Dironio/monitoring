import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSiteContext } from '../../../../utils/SiteContext';
import ScrollHeatmapVisualization from './ScrollHeatmapComponent';
import './ScrollHeatmap.css';

interface ScrollPoint {
    scroll_top: number;
    scroll_percentage: number;
}

interface BucketedScrollPoint {
    y: number;
    intensity: number;
}

const ScrollHeatmap: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [heatmapData, setHeatmapData] = useState<BucketedScrollPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const fetchScrollData = async () => {
        if (!selectedSite || !selectedPage) return;

        setIsLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/events/scroll-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;
            const response = await axios.get<{ scroll_top: number }[]>(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const rawData = response.data;

            // Grouping into 100px buckets
            const bucketSize = 10; // Было 100
            const bucketMap = new Map<number, number>();
            rawData.forEach(({ scroll_top }) => {
                const bucket = Math.floor(scroll_top / bucketSize) * bucketSize;
                bucketMap.set(bucket, (bucketMap.get(bucket) || 0) + 1);
            });

            const maxCount = Math.max(...Array.from(bucketMap.values()));
            const points: BucketedScrollPoint[] = Array.from(bucketMap.entries()).map(([y, count]) => ({
                y,
                intensity: count / maxCount
            }));

            setHeatmapData(points);
            setIsHeatmapVisible(true);

            setTimeout(() => {
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err) {
            console.error('Ошибка загрузки scroll heatmap:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleHeatmapVisibility = () => {
        setIsHeatmapVisible(prev => !prev);
    };

    return (
        <div className="heatmap-container">
            <div className="heatmap-controls">
                <button onClick={fetchScrollData} disabled={isLoading} className="generate-heatmap-btn">
                    {isLoading ? 'Загрузка...' : 'Построить тепловую карту скролла'}
                </button>
                <button onClick={toggleHeatmapVisibility} disabled={heatmapData.length === 0} className="toggle-heatmap-btn">
                    {isHeatmapVisible ? 'Скрыть тепловую карту' : 'Показать тепловую карту'}
                </button>
            </div>

            <div className="page-container-wrapper">
                <div className="page-container" ref={containerRef} style={{ position: 'relative' }}>
                    <iframe
                        ref={iframeRef}
                        src={selectedPage?.value}
                        className={`page-container__iframe ${isHeatmapVisible ? 'page-container__iframe--disabled' : ''}`}
                        title="Scroll Heatmap Target"
                        style={{ width: '100%', height: '5000px', border: 'none', position: 'relative', zIndex: 1 }}
                    />

                    <div className={`heatmap-overlay ${isHeatmapVisible ? 'heatmap-overlay--visible' : ''}`}>
                        {heatmapData.map((point, index) => {
                            // Процент прокрутки (0% = начало страницы, 100% = конец)
                            const scrollPercentage = point.y / 5000; // 3000px — высота iframe
                            // Цвет от красного (0%) до синего (100%)
                            const hue = 240 * scrollPercentage; // 0 = красный, 240 = синий (HSL)
                            return (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: `${point.y}px`,
                                        left: 0,
                                        width: '100%',
                                        height: '100px',
                                        background: `hsla(${hue}, 100%, 50%, ${point.intensity * 0.7})`,
                                        pointerEvents: 'none',
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollHeatmap;



// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useSiteContext } from '../../../../utils/SiteContext';
// import './ScrollHeatmap.css';

// interface BucketedScrollPoint {
//     y: number;
//     intensity: number;
// }

// const ScrollHeatmap: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [heatmapData, setHeatmapData] = useState<BucketedScrollPoint[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
//     const [opacityIntensity, setOpacityIntensity] = useState(0.7);
//     const [bucketSize, setBucketSize] = useState(10); // <-- Вынесено в состояние
//     const containerRef = useRef<HTMLDivElement>(null);
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const [iframeHeight, setIframeHeight] = useState(3000);

//     // Автоподгрузка при изменении bucketSize
//     useEffect(() => {
//         if (heatmapData.length > 0) {
//             fetchScrollData();
//         }
//     }, [bucketSize]);

//     const fetchScrollData = async () => {
//         if (!selectedSite || !selectedPage) return;

//         setIsLoading(true);
//         try {
//             const url = `${process.env.REACT_APP_API_URL}/events/scroll-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;
//             const response = await axios.get<{ scroll_top: number }[]>(url, {
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const rawData = response.data;
//             const bucketMap = new Map<number, number>();

//             rawData.forEach(({ scroll_top }) => {
//                 const bucket = Math.floor(scroll_top / bucketSize) * bucketSize;
//                 bucketMap.set(bucket, (bucketMap.get(bucket) || 0) + 1);
//             });

//             const maxCount = Math.max(...Array.from(bucketMap.values()), 1); // Добавлена защита от деления на 0
//             const points = Array.from(bucketMap.entries()).map(([y, count]) => ({
//                 y,
//                 intensity: count / maxCount
//             }));

//             setHeatmapData(points);
//         } catch (err) {
//             console.error('Ошибка загрузки:', err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Проверка данных в консоли
//     useEffect(() => {
//         console.log('Heatmap data:', heatmapData);
//     }, [heatmapData]);

//     return (
//         <div className="scroll-heatmap-container">
//             {/* Контролы */}
//             <div className="controls">
//                 <button onClick={fetchScrollData} disabled={isLoading}>
//                     {isLoading ? 'Загрузка...' : 'Обновить карту'}
//                 </button>
                
//                 <label>
//                     Точность:
//                     <input 
//                         type="range"
//                         min="5"
//                         max="50"
//                         value={bucketSize}
//                         onChange={(e) => setBucketSize(parseInt(e.target.value))}
//                     />
//                     {bucketSize}px
//                 </label>

//                 <label>
//                     Прозрачность:
//                     <input 
//                         type="range"
//                         min="0.1"
//                         max="1"
//                         step="0.1"
//                         value={opacityIntensity}
//                         onChange={(e) => setOpacityIntensity(parseFloat(e.target.value))}
//                     />
//                 </label>

//                 <button 
//                     onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
//                     disabled={heatmapData.length === 0}
//                 >
//                     {isHeatmapVisible ? 'Скрыть' : 'Показать'}
//                 </button>
//             </div>

//             {/* Область просмотра */}
//             <div className="iframe-container" ref={containerRef}>
//                 <iframe
//                     ref={iframeRef}
//                     src={selectedPage?.value}
//                     style={{ 
//                         width: '100%', 
//                         height: `${iframeHeight}px`,
//                         border: 'none',
//                         position: 'relative',
//                         zIndex: 1
//                     }}
//                     onLoad={() => {
//                         const doc = iframeRef.current?.contentDocument;
//                         const height = doc?.documentElement.scrollHeight || doc?.body.scrollHeight || 3000;
//                         setIframeHeight(height);
//                     }}
//                 />

//                 {isHeatmapVisible && (
//                     <div 
//                         className="heatmap-overlay"
//                         style={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             width: '100%',
//                             height: `${iframeHeight}px`,
//                             zIndex: 2,
//                             pointerEvents: 'none'
//                         }}
//                     >
//                         {heatmapData.map((point, index) => (
//                             <div
//                                 key={index}
//                                 style={{
//                                     position: 'absolute',
//                                     top: `${point.y}px`,
//                                     left: 0,
//                                     width: '100%',
//                                     height: `${bucketSize}px`,
//                                     background: `hsla(${240 * (point.y / iframeHeight)}, 100%, 50%, ${point.intensity * opacityIntensity})`,
//                                 }}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ScrollHeatmap;