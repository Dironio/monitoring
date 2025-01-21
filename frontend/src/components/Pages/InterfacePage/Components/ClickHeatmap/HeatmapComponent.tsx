// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Select from 'react-select';
// import axios from 'axios';
// // import './HeatmapPage.css';
// import h337 from 'heatmap.js';
// import type { Heatmap, DataPoint } from 'heatmap.js';
// import { User } from '../../../../models/user.model';
// import { WebSite } from '../../../../models/site.model';
// import { ClickData, HeatmapData, PageData, RawEvent } from '../../../../models/event.model';
// import { PageOption } from '../../hooks/useHeatmaps';



// type HeatmapInstance = Heatmap<'value', 'x', 'y'>;

// interface HeatmapComponentProps {
//     user: User | null;
//     loading: boolean;
// }



// interface EventData {
//     duration?: number;
//     scrollTop?: number;
//     scrollPercentage?: number;
//     x?: number;
//     y?: number;
// }

// interface HeatmapPoint {
//     x: number;
//     y: number;
//     value: number;
// }

// const HeatmapComponent: React.FC<HeatmapComponentProps> = ({ user, loading }) => {
//     const [selectedPage, setSelectedPage] = useState<PageOption | null>(null);
//     const [isLoadingData, setIsLoadingData] = useState(false);
//     const [pages, setPages] = useState<PageOption[]>([]);
//     const [heatmapInstance, setHeatmapInstance] = useState<Heatmap<'value', 'x', 'y'> | null>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const savedSite = localStorage.getItem('selectedSite');
//     const site = savedSite ? JSON.parse(savedSite) : null;

//     // Функция для пересчета размеров и позиции тепловой карты
//     const updateHeatmapSize = useCallback(() => {
//         if (containerRef.current && heatmapInstance && iframeRef.current) {
//             const iframe = iframeRef.current;
//             const container = containerRef.current;

//             // Установка размеров контейнера тепловой карты равными размерам iframe
//             container.style.width = `${iframe.offsetWidth}px`;
//             container.style.height = `${iframe.offsetHeight}px`;

//             // Обновление размеров canvas тепловой карты
//             heatmapInstance.repaint();
//         }
//     }, [heatmapInstance]);

// Обработчик загрузки iframe
// const handleIframeLoad = useCallback(() => {
//     updateHeatmapSize();
// Блокируем все события в iframe
//     if (iframeRef.current) {
//         const iframe = iframeRef.current;
//         iframe.style.pointerEvents = 'none';

//         try {
//             const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
//             if (iframeDoc) {
//                 // Добавляем стили для блокировки взаимодействия
//                 const style = iframeDoc.createElement('style');
//                 style.textContent = `
//                     * {
//                         pointer-events: none !important;
//                         user-select: none !important;
//                     }
//                 `;
//                 iframeDoc.head.appendChild(style);
//             }
//         } catch (e) {
//             console.error('Cannot access iframe document:', e);
//         }
//     }
// }, [updateHeatmapSize]);

// const fetchHeatmapData = useCallback(async () => {
//     if (!selectedPage || !heatmapInstance || !site?.value) return;

//     setIsLoadingData(true);
//     try {
//         const response = await axios.get<HeatmapData[]>(
//             `${process.env.REACT_APP_API_URL}/events/click-heatmap`,
//             {
//                 params: {
//                     web_id: site.value,
//                     page_url: selectedPage.value
//                 },
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                 },
//             }
//         );

//         const points = response.data.map(item => ({
//             x: Math.round(item.eventData.x),
//             y: Math.round(item.eventData.y),
//             value: item.clickCount
//         }));

//         if (points.length > 0) {
//             // Нормализация значений
//             const maxValue = Math.max(...points.map(p => p.value));
//             const normalizedPoints = points.map(point => ({
//                 ...point,
//                 value: (point.value / maxValue) * 100 // Нормализуем до 100
//             }));

//             heatmapInstance.setData({
//                 max: 100,
//                 min: 0,
//                 data: normalizedPoints
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching heatmap data:', error);
//     } finally {
//         setIsLoadingData(false);
//     }
// }, [selectedPage, heatmapInstance, site?.value]);

// const fetchHeatmapData = useCallback(async () => {
//     if (!selectedPage || !heatmapInstance || !site?.value) {
//         console.log('Missing required data:', {
//             selectedPage: !!selectedPage,
//             heatmapInstance: !!heatmapInstance,
//             siteValue: site?.value
//         });
//         return;
//     }

//     setIsLoadingData(true);
//     try {
//         // Логируем параметры запроса
//         console.log('Request params:', {
//             webId: site.value,
//             pageUrl: selectedPage.value
//         });

//         const response = await axios.get<HeatmapData[]>(
//             `${process.env.REACT_APP_API_URL}/events/click-heatmap`,
//             {
//                 params: {
//                     web_id: site.value,
//                     page_url: encodeURIComponent(selectedPage.value) // Кодируем URL
//                 },
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                 }
//             }
//         );

//         console.log('Raw response:', response.data);

//         // Проверяем наличие данных
//         if (!response.data || response.data.length === 0) {
//             console.log('No heatmap data received');
//             if (heatmapInstance) {
//                 heatmapInstance.setData({
//                     max: 1,
//                     min: 0,
//                     data: []
//                 });
//             }
//             return;
//         }

//         // Преобразуем и нормализуем данные
//         const points = response.data.map(item => ({
//             x: Math.round(item.eventData.x),
//             y: Math.round(item.eventData.y),
//             value: item.clickCount
//         }));

//         console.log('Processed points:', points);

//         // Находим максимальное значение для нормализации
//         const maxValue = Math.max(...points.map(p => p.value));
//         console.log('Max value:', maxValue);

//         // Проверяем существование heatmapInstance перед установкой данных
//         if (heatmapInstance && points.length > 0) {
//             // Устанавливаем данные с более явными настройками
//             heatmapInstance.setData({
//                 max: maxValue || 1,
//                 min: 0,
//                 data: points.map(point => ({
//                     x: point.x,
//                     y: point.y,
//                     value: point.value
//                 }))
//             });

//             // Вызываем repaint для обновления визуализации
//             heatmapInstance.repaint();
//             console.log('Heatmap data set and repainted');
//         } else {
//             console.log('Heatmap instance not available or no points to display');
//         }

//     } catch (error) {
//         console.error('Error fetching heatmap data:', error);
//         if (error) {
//             console.log('Response data:', error);
//             console.log('Response status:', error);
//         }
//     } finally {
//         setIsLoadingData(false);
//     }
// }, [selectedPage, heatmapInstance, site?.value]);

// // Инициализация heatmap

// // Слушатель изменения размера окна
// const handlePageChange = (option: PageOption | null) => {
//     setSelectedPage(option);
//     if (heatmapInstance) {
//         heatmapInstance.setData({ data: [], max: 1, min: 0 }); // Очищаем текущие данные
//     }
// };

// // Добавляем useEffect для вызова fetchHeatmapData
// useEffect(() => {
//     if (selectedPage && heatmapInstance) {
//         fetchHeatmapData();
//     }
// }, [selectedPage, heatmapInstance, fetchHeatmapData]);

// const fetchPages = useCallback(async () => {
//     if (!site?.value) return;

//     try {
//         const response = await axios.get<string[]>(
//             `${process.env.REACT_APP_API_URL}/events/pages`,
//             {
//                 params: { web_id: site.value },
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                 },
//             }
//         );

//         const pageOptions = response.data.map(page => ({
//             value: page,
//             label: page
//         }));
//         setPages(pageOptions);
//     } catch (error) {
//         console.error('Error fetching pages:', error);
//     }
// }, [site?.value]);

// // useEffect для начальной загрузки страниц
// useEffect(() => {
//     fetchPages();
// }, [fetchPages]);

// // useEffect для инициализации heatmap
// useEffect(() => {
//     if (containerRef.current && !heatmapInstance) {
//         const instance = h337.create({
//             container: containerRef.current,
//             radius: 25,
//             maxOpacity: 0.8,
//             minOpacity: 0.3,
//             blur: 0.75,
//             gradient: {
//                 '.2': 'blue',
//                 '.4': 'cyan',
//                 '.6': 'lime',
//                 '.8': 'yellow',
//                 '1.0': 'red'
//             }
//         });
//         setHeatmapInstance(instance);
//         console.log('Heatmap instance created');
//     }

//     return () => {
//         if (heatmapInstance) {
//             heatmapInstance.setData({ data: [], max: 1, min: 0 });
//             setHeatmapInstance(null);
//         }
//     };
// }, []);

// if (loading) return <div>Loading...</div>;
// if (!user) return <div>Please log in</div>;
// if (!site) return <div>Please select a site first</div>;

//     return (
//         <div className="heatmap-page">
//             <div className="heatmap-controls">
//                 <h2>Тепловая карта кликов</h2>
//                 <div className="page-select-container">
//                     <label>Выберите страницу:</label>
//                     <Select<PageOption>
//                         value={selectedPage}
//                         onChange={handlePageChange}
//                         options={pages}
//                         className="page-select"
//                         placeholder="Выберите страницу"
//                         isDisabled={!site || pages.length === 0 || isLoadingData}
//                     />
//                 </div>
//                 {isLoadingData && <div className="loading-indicator">Загрузка данных...</div>}
//             </div>

//             <div className="heatmap-content" style={{ position: 'relative', zIndex: 1 }}>
//                 <div className="heatmap-visualization">
//                     <div
//                         className="heatmap-container"
//                         style={{
//                             width: '100%',
//                             height: 'calc(100vh - 200px)',
//                             position: 'relative',
//                             overflow: 'hidden'
//                         }}
//                     >
//                         {selectedPage ? (
//                             <>
//                                 <iframe
//                                     ref={iframeRef}
//                                     src={selectedPage.value}
//                                     style={{
//                                         width: '100%',
//                                         height: '100%',
//                                         border: 'none',
//                                         position: 'absolute',
//                                         top: 0,
//                                         left: 0,
//                                         zIndex: 1
//                                     }}
//                                     title="Page preview"
//                                 />
//                                 <div
//                                     ref={containerRef}
//                                     style={{
//                                         position: 'absolute',
//                                         top: 0,
//                                         left: 0,
//                                         width: '100%',
//                                         height: '100%',
//                                         zIndex: 2,
//                                         pointerEvents: 'none'
//                                     }}
//                                 />
//                             </>
//                         ) : (
//                             <div className="no-page-selected">
//                                 Выберите страницу для отображения тепловой карты
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default HeatmapComponent;

import { useCallback, useEffect, useState } from "react";
import { User } from "../../../../../models/user.model";
import { PageOption, useHeatmap } from "../../../hooks/useHeatmaps";
import { usePages } from "../../../hooks/usePages";
import PageSelector from "../../../../UI/PageSelector";
import SiteSelection from "../../../../UI/SiteSelection";
import axios from "axios";
import HeatmapVisualization from "./HeatmapVisualisation";

interface HeatmapComponentProps {
    user: User | null;
    loading: boolean;
}

interface Heat {
    points: Array<{
        x: number;
        y: number;
        count: number;
    }>;
    maxCount: number | null;
}

const HeatmapComponent: React.FC<HeatmapComponentProps> = ({ user, loading }) => {
    const [selectedPage, setSelectedPage] = useState<PageOption | null>(null);
    const savedSite = localStorage.getItem('selectedSite');
    const site = savedSite ? JSON.parse(savedSite) : null;

    const fetchClicks = useCallback(async () => {
        if (!selectedPage?.value || !site?.value) {
            console.log('Отсутствуют необходимые данные:', {
                selectedPage: !!selectedPage?.value,
                siteValue: site?.value
            });
            return;
        }

        // setIsLoadingData(true);
        try {
            // Формируем URL с параметрами напрямую
            const url = `${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${site.value}&page_url=${selectedPage.value}`;

            console.log('Отправляем запрос по URL:', url);

            const result = await axios.get<Heat>(
                url,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Ответ сервера:', result.data);

            if (result.data.points && result.data.points.length > 0) {
                const formattedPoints = result.data.points.map(point => ({
                    x: point.x,
                    y: point.y,
                    value: point.count
                }));

                console.log('Отформатированные точки:', formattedPoints);

                if (heatmapInstance) {
                    heatmapInstance.setData({
                        max: result.data.maxCount || Math.max(...result.data.points.map(p => p.count)),
                        min: 0,
                        data: formattedPoints
                    });
                }
            } else {
                console.log('Нет данных для отображения');
                if (heatmapInstance) {
                    heatmapInstance.setData({ data: [], max: 1, min: 0 });
                }
            }

        } catch (error) {
            console.error('Ошибка запроса:', error)
        }
    }, [selectedPage?.value, site?.value]);


    const {
        isLoadingData,
        heatmapInstance,
        containerRef,
        iframeRef,
        updateHeatmapSize,
        fetchHeatmapData,
    } = useHeatmap({ site, selectedPage });

    const { pages, fetchPages } = usePages(site);

    useEffect(() => {
        if (site) {
            fetchPages();
        }
    }, [site, fetchPages]);

    useEffect(() => {
        if (selectedPage && site) {
            fetchHeatmapData();
        }
    }, [selectedPage, site, fetchHeatmapData]);

    useEffect(() => {
        const handleResize = () => {
            updateHeatmapSize();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateHeatmapSize]);

    const handlePageChange = (option: PageOption | null) => {
        setSelectedPage(option);
        if (heatmapInstance) {
            heatmapInstance.setData({ data: [], max: 1, min: 0 });
        }
    };

    if (loading) {
        return <div className="loading-state">Loading...</div>;
    }

    if (!user) {
        return <div className="error-state">Please log in to view heatmap data</div>;
    }

    return (
        <div className="heatmap-page">
            {/* <SiteSelection user={user} loading={loading} /> */}
            <div className="heatmap-controls">
                <h2 className="heatmap-title">Тепловая карта кликов</h2>
                <button onClick={fetchClicks}>CLICK</button>
                <div className="page-select-container">
                    <label htmlFor="page-select" className="page-select-label">
                        Выберите страницу:
                    </label>
                    {/* <PageSelector
                        selectedPage={selectedPage}
                        pages={pages}
                        onPageChange={handlePageChange}
                        isDisabled={!site || pages.length === 0 || isLoadingData}
                    /> */}
                </div>
                {isLoadingData && (
                    <div className="loading-indicator" role="status" aria-live="polite">
                        Загрузка данных...
                    </div>
                )}
            </div>

            <HeatmapVisualization
                selectedPage={selectedPage}
                containerRef={containerRef}
                iframeRef={iframeRef}
                site={site}
                user={user}
                loading={loading}
            />
        </div>
    )
}

export default HeatmapComponent;