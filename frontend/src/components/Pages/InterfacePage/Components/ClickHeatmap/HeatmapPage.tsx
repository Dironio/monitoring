import React, { useEffect, useRef, useState } from 'react';
import './heatmap.css'
import HeatmapVisualization, { ClickHeatmapData } from './HeatmapVisual';
import axios from 'axios';
import { User } from '../../../../../models/user.model';
import { useSiteContext } from '../../../../utils/SiteContext';
import { getAPI } from '../../../../utils/axiosGet';
// import HeatmapPoints from './HeatmapPoints';

interface HeatmapPoint {
    x: number;
    y: number;
    count: number;
}

interface HeatmapResponse {
    points: HeatmapPoint[];
    maxCount: number;
}

interface HeatmapPageProps {
    user: User | null;
    loading: boolean;
}


// const HeatmapPage: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [heatmapData, setHeatmapData] = useState<ClickHeatmapData[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [showDots, setShowDots] = useState(false);
//     const [debugMode, setDebugMode] = useState(false);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [scale, setScale] = useState({ x: 1, y: 1 });
//     const [maxClicks, setMaxClicks] = useState(0);
//     const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

//     const getPointColor = (clicks: number) => {
//         const normalized = clicks / maxClicks;

//         if (normalized < 0.2) return 'rgb(0, 150, 255)';
//         if (normalized < 0.4) return 'rgb(0, 255, 255)';
//         if (normalized < 0.6) return 'rgb(0, 255, 150)';
//         if (normalized < 0.8) return 'rgb(255, 150, 0)';
//         return 'rgb(255, 0, 0)';
//     };

//     const getPointSize = (clicks: number) => {
//         const baseSize = 16;
//         const maxSize = 24;
//         const size = baseSize + (clicks / maxClicks) * (maxSize - baseSize);
//         return `${size}px`;
//     };

//     const handleGenerateHeatmap = async () => {
//         if (!selectedSite || !selectedPage) {
//             alert('Пожалуйста, выберите сайт и страницу');
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const url = `${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;

//             const response = await axios.get<HeatmapResponse>(url, {
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log('Исходные данные:', response.data);

//             const formattedData = response.data.points.map(point => ({
//                 eventData: {
//                     x: Number(point.x),
//                     y: Number(point.y)
//                 },
//                 clickCount: Number(point.count)
//             }));

//             console.log('Отформатированные данные:', formattedData);
//             setHeatmapData(formattedData);

//         } catch (error) {
//             console.error('Error fetching heatmap data:', error);
//             if (error) {
//                 console.log('Response data:', error);
//                 console.log('Response status:', error);
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (containerRef.current && heatmapData.length > 0) {
//             const container = containerRef.current;
//             const iframe = container.querySelector('iframe');

//             if (iframe) {
//                 iframe.onload = () => {
//                     const containerRect = container.getBoundingClientRect();
//                     const iframeRect = iframe.getBoundingClientRect();

//                     // Находим максимальные координаты из данных
//                     const maxX = Math.max(...heatmapData.map(point => point.eventData.x));
//                     const maxY = Math.max(...heatmapData.map(point => point.eventData.y));

//                     // Вычисляем коэффициенты масштабирования
//                     setScale({
//                         x: iframeRect.width / maxX,
//                         y: iframeRect.height / maxY
//                     });

//                     // Устанавливаем максимальное количество кликов
//                     setMaxClicks(Math.max(...heatmapData.map(point => point.clickCount)));
//                 };
//             }
//         }
//     }, [heatmapData]);

//     useEffect(() => {
//         const updateDimensions = () => {
//             if (containerRef.current) {
//                 const { width, height } = containerRef.current.getBoundingClientRect();
//                 setContainerDimensions({ width, height });
//             }
//         };

//         updateDimensions();
//         window.addEventListener('resize', updateDimensions);

//         return () => window.removeEventListener('resize', updateDimensions);
//     }, []);

//     // Проверяем наличие данных и выводим в консоль
//     useEffect(() => {
//         console.log('Текущие данные:', heatmapData);
//         console.log('Количество точек:', heatmapData.length);
//     }, [heatmapData]);

//     return (
//         <div className="heatmap-container">
//             <div className="heatmap-controls">
//                 <button
//                     onClick={handleGenerateHeatmap}
//                     disabled={isLoading || !selectedSite || !selectedPage}
//                     className="generate-heatmap-btn"
//                 >
//                     {isLoading ? 'Загрузка...' : 'Построить тепловую карту'}
//                 </button>
//                 <button
//                     onClick={() => setShowDots(!showDots)}
//                     className="toggle-dots-btn"
//                     disabled={!heatmapData || heatmapData.length === 0}
//                 >
//                     {showDots ? 'Скрыть точки' : 'Показать точки'}
//                 </button>
//                 <button
//                     onClick={() => setDebugMode(!debugMode)}
//                     className="toggle-dots-btn"
//                     disabled={!heatmapData || heatmapData.length === 0}
//                 >
//                     {debugMode ? 'Режим просмотра' : 'Режим отладки'}
//                 </button>
//             </div>

//             <div className="page-container" ref={containerRef}>
//                 {!debugMode && (
//                     <iframe
//                         src={selectedPage?.value}
//                         className='page-container__iframe'
//                     />
//                 )}
//                 {showDots && heatmapData.length > 0 && (
//                     <HeatmapPoints
//                         points={heatmapData}
//                         containerWidth={containerDimensions.width}
//                         containerHeight={containerDimensions.height}
//                         debugMode={debugMode}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };


// const HeatmapPage: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [heatmapData, setHeatmapData] = useState<ClickHeatmapData[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isHeatmapVisible, setIsHeatmapVisible] = useState(false); // Видимость тепловой карты
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

//     const handleGenerateHeatmap = async () => {
//         if (!selectedSite || !selectedPage) {
//             alert('Пожалуйста, выберите сайт и страницу');
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const url = `${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;
//             const response = await axios.get<HeatmapResponse>(url, {
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const formattedData = response.data.points.map(point => ({
//                 eventData: {
//                     x: Number(point.x),
//                     y: Number(point.y)
//                 },
//                 clickCount: Number(point.count)
//             }));
//             setHeatmapData(formattedData);
//         } catch (error) {
//             console.error('Ошибка при загрузке данных:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         const updateDimensions = () => {
//             if (containerRef.current) {
//                 const { width, height } = containerRef.current.getBoundingClientRect();
//                 setContainerDimensions({ width, height });
//             }
//         };
//         updateDimensions();
//         window.addEventListener('resize', updateDimensions);
//         return () => window.removeEventListener('resize', updateDimensions);
//     }, []);

//     return (
//         <div className="heatmap-container">
//             <div className="heatmap-controls">
//                 <button
//                     onClick={handleGenerateHeatmap}
//                     disabled={isLoading || !selectedSite || !selectedPage}
//                     className="generate-heatmap-btn"
//                 >
//                     {isLoading ? 'Загрузка...' : 'Построить тепловую карту'}
//                 </button>
//                 <button
//                     onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
//                     className="toggle-heatmap-btn"
//                     disabled={!heatmapData || heatmapData.length === 0}
//                 >
//                     {isHeatmapVisible ? 'Скрыть тепловую карту' : 'Показать тепловую карту'}
//                 </button>
//             </div>
//             <div className="page-container" ref={containerRef}>
//                 <iframe
//                     src={selectedPage?.value}
//                     className='page-container__iframe'
//                 />
//                 <HeatmapVisualization
//                     data={heatmapData}
//                     containerWidth={containerDimensions.width}
//                     containerHeight={containerDimensions.height}
//                     isVisible={isHeatmapVisible}
//                 />
//             </div>
//         </div>
//     );
// };











// const HeatmapPage: React.FC = () => {
//     const { selectedSite, selectedPage } = useSiteContext();
//     const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [containerDimensions, setContainerDimensions] = useState({
//         width: 0,
//         height: 0
//     });

//     const handleGenerateHeatmap = async () => {
//         if (!selectedSite || !selectedPage) {
//             alert('Пожалуйста, выберите сайт и страницу');
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const url = `${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;
//             const response = await axios.get<HeatmapResponse>(url, {
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             setHeatmapData(response.data.points.map(p => ({
//                 x: p.x,
//                 y: p.y,
//                 value: p.count
//             })));

//             setIsHeatmapVisible(true);
//         } catch (error) {
//             console.error('Error loading heatmap data:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!containerRef.current) return;

//         const updateDimensions = () => {
//             const rect = containerRef.current?.getBoundingClientRect();
//             if (rect) {
//                 setContainerDimensions({
//                     width: rect.width,
//                     height: rect.height
//                 });
//             }
//         };

//         updateDimensions();
//         const observer = new ResizeObserver(updateDimensions);
//         observer.observe(containerRef.current);

//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div className="heatmap-container">
//             <div className="heatmap-controls">
//                 <button onClick={handleGenerateHeatmap} disabled={isLoading}>
//                     {isLoading ? 'Загрузка...' : 'Построить тепловую карту'}
//                 </button>
//                 <button
//                     onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
//                     disabled={!heatmapData.length}
//                 >
//                     {isHeatmapVisible ? 'Скрыть' : 'Показать'}
//                 </button>
//             </div>

//             <div className="page-container" ref={containerRef}>
//                 <iframe
//                     src={selectedPage?.value}
//                     className="page-container__iframe"
//                     style={{
//                         width: '100%',
//                         height: '100%',
//                         border: 'none'
//                     }}
//                 />
//                 <HeatmapVisualization
//                     data={heatmapData}
//                     containerWidth={containerDimensions.width}
//                     containerHeight={containerDimensions.height}
//                     isVisible={isHeatmapVisible}
//                 />
//             </div>
//         </div>
//     );
// };



const HeatmapPage: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [heatmapData, setHeatmapData] = useState<ClickHeatmapData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    const handleGenerateHeatmap = async () => {
        if (!selectedSite || !selectedPage) {
            alert('Пожалуйста, выберите сайт и страницу');
            return;
        }
        setIsLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;
            const response = await axios.get<HeatmapResponse>(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const formattedData = response.data.points.map(point => ({
                eventData: {
                    x: Number(point.x),
                    y: Number(point.y)
                },
                clickCount: Number(point.count)
            }));
            setHeatmapData(formattedData);
            setIsHeatmapVisible(true);
            
            // Скролл к контейнеру с тепловой картой
            setTimeout(() => {
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleHeatmapVisibility = () => {
        setIsHeatmapVisible(!isHeatmapVisible);
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setContainerDimensions({ width, height });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Блокируем iframe при показе тепловой карты
    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.classList.toggle('page-container__iframe--disabled', isHeatmapVisible);
        }
    }, [isHeatmapVisible]);

    return (
        <div className="heatmap-container">
            <div className="heatmap-controls">
                <button
                    onClick={handleGenerateHeatmap}
                    disabled={isLoading || !selectedSite || !selectedPage}
                    className="generate-heatmap-btn"
                >
                    {isLoading ? 'Загрузка...' : 'Построить тепловую карту'}
                </button>
                <button
                    onClick={toggleHeatmapVisibility}
                    className="toggle-heatmap-btn"
                    disabled={!heatmapData || heatmapData.length === 0}
                >
                    {isHeatmapVisible ? 'Скрыть тепловую карту' : 'Показать тепловую карту'}
                </button>
            </div>
            <div className="page-container-wrapper">
                <div className="page-container" ref={containerRef}>
                    <iframe
                        ref={iframeRef}
                        src={selectedPage?.value}
                        className="page-container__iframe"
                        title="Heatmap target page"
                    />
                    <HeatmapVisualization
                        data={heatmapData}
                        containerWidth={containerDimensions.width}
                        containerHeight={containerDimensions.height}
                        isVisible={isHeatmapVisible}
                    />
                </div>
            </div>
        </div>
    );
};


export default HeatmapPage;