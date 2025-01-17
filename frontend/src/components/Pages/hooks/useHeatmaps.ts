import { useState, useCallback, useRef, useEffect } from 'react';
import h337, { Heatmap } from 'heatmap.js';
import axios from 'axios';
import { HeatmapData, HeatmapPoint, HeatmapResponseData } from '../../../models/event.model';

export interface PageOption {
    value: string;
    label: string;
}

interface UseHeatmapProps {
    site: { value: string } | null;
    selectedPage: PageOption | null;
}

// export const useHeatmap = ({ site, selectedPage }: UseHeatmapProps) => {
//     const [isLoadingData, setIsLoadingData] = useState(false);
//     const [heatmapInstance, setHeatmapInstance] = useState<Heatmap<'value', 'x', 'y'> | null>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const iframeRef = useRef<HTMLIFrameElement>(null);

//     useEffect(() => {
//         if (containerRef.current && !heatmapInstance) {
//             const instance = h337.create({
//                 container: containerRef.current,
//                 radius: 30,
//                 maxOpacity: 0.6,
//                 minOpacity: 0,
//                 blur: 0.75
//             });
//             setHeatmapInstance(instance);
//         }
//     }, [containerRef.current]);

//     const updateHeatmapSize = useCallback(() => {
//         if (containerRef.current && heatmapInstance && iframeRef.current) {
//             const iframe = iframeRef.current;
//             const container = containerRef.current;

//             container.style.width = `${iframe.offsetWidth}px`;
//             container.style.height = `${iframe.offsetHeight}px`;

//             const canvas = container.querySelector('canvas');
//             if (canvas) {
//                 canvas.width = iframe.offsetWidth;
//                 canvas.height = iframe.offsetHeight;
//             }

//             heatmapInstance.repaint();
//         }
//     }, [heatmapInstance]);

//     const fetchHeatmapData = useCallback(async () => {
//         if (!selectedPage || !site?.value) {
//             return;
//         }

//         if (!heatmapInstance) {
//             console.log('Waiting for heatmap initialization...');
//             return;
//         }

//         setIsLoadingData(true);
//         try {
//             const response = await axios.get<HeatmapResponseData>(
//                 `${process.env.REACT_APP_API_URL}/events/click-heatmap`,
//                 {
//                     params: {
//                         web_id: site.value,
//                         page_url: encodeURIComponent(selectedPage.value)
//                     },
//                     withCredentials: true,
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                     }
//                 }
//             );

//             const { points, maxCount } = response.data;

//             if (!points || points.length === 0) {
//                 heatmapInstance.setData({ data: [], max: 1, min: 0 });
//                 return;
//             }

//             const formattedData: { max: number; min: number; data: HeatmapPoint[] } = {
//                 max: maxCount || Math.max(...points.map(p => p.count)),
//                 min: 0,
//                 data: points.map((point): HeatmapPoint => ({
//                     x: Math.round(point.x),
//                     y: Math.round(point.y),
//                     value: point.count
//                 }))
//             };

//             heatmapInstance.setData(formattedData);
//             updateHeatmapSize();

//         } catch (error) {
//             console.error('Error fetching heatmap data:', error);
//         } finally {
//             setIsLoadingData(false);
//         }
//     }, [selectedPage, site?.value, heatmapInstance, updateHeatmapSize]);

//     useEffect(() => {
//         if (selectedPage) {
//             const timer = setTimeout(() => {
//                 updateHeatmapSize();
//             }, 1000);

//             return () => clearTimeout(timer);
//         }
//     }, [selectedPage, updateHeatmapSize]);

//     useEffect(() => {
//         return () => {
//             if (heatmapInstance) {
//                 heatmapInstance.setData({ data: [], max: 1, min: 0 });
//             }
//         };
//     }, []);

//     return {
//         isLoadingData,
//         heatmapInstance,
//         containerRef,
//         iframeRef,
//         updateHeatmapSize,
//         fetchHeatmapData
//     };
// };



interface HeatmapClickData {
    x: number;
    y: number;
    count: number;
}

interface HeatmapResponse {
    points: HeatmapClickData[];
    maxCount: number;
}

export const useHeatmap = ({ site, selectedPage }: UseHeatmapProps) => {
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [heatmapInstance, setHeatmapInstance] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const initializationAttempted = useRef(false);

    // Инициализация тепловой карты
    useEffect(() => {
        if (containerRef.current && !heatmapInstance) {
            console.log('Creating heatmap instance...');
            const instance = h337.create({
                container: containerRef.current,
                radius: 25,
                maxOpacity: 0.9,
                minOpacity: 0.1,
                blur: 0.85,
                gradient: {
                    '.2': 'blue',
                    '.4': 'green',
                    '.6': 'yellow',
                    '.8': 'orange',
                    '1.0': 'red'
                }
            });
            setHeatmapInstance(instance);
        }
    }, []);

    const updateHeatmapSize = useCallback(() => {
        if (containerRef.current && iframeRef.current && heatmapInstance) {
            const iframe = iframeRef.current;
            const container = containerRef.current;

            container.style.width = `${iframe.offsetWidth}px`;
            container.style.height = `${iframe.offsetHeight}px`;

            const canvas = container.querySelector('canvas');
            if (canvas) {
                canvas.width = iframe.offsetWidth;
                canvas.height = iframe.offsetHeight;
            }

            heatmapInstance.repaint();
        }
    }, [heatmapInstance]);

    const initHeatmap = useCallback(() => {
        if (containerRef.current && !heatmapInstance && !initializationAttempted.current) {
            console.log('Инициализация тепловой карты...');
            try {
                const instance = h337.create({
                    container: containerRef.current,
                    radius: 25,
                    maxOpacity: 0.9,
                    minOpacity: 0,
                    blur: 0.85,
                    gradient: {
                        '.5': 'blue',
                        '.8': 'red',
                        '.95': 'white'
                    }
                });
                setHeatmapInstance(instance);
                initializationAttempted.current = true;
                console.log('Тепловая карта успешно инициализирована');
                return instance;
            } catch (error) {
                console.error('Ошибка при инициализации тепловой карты:', error);
            }
        }
        return null;
    }, []);

    // Инициализация при монтировании
    useEffect(() => {
        const timer = setTimeout(() => {
            initHeatmap();
        }, 500); // Даем время на рендер контейнера

        return () => {
            clearTimeout(timer);
            if (heatmapInstance) {
                heatmapInstance.setData({ data: [], max: 1 });
            }
        };
    }, []);

    // const fetchHeatmapData = useCallback(async () => {
    //     if (!selectedPage || !site?.value || !heatmapInstance) {
    //         console.log('Missing required data:', {
    //             selectedPage: !!selectedPage,
    //             heatmapInstance: !!heatmapInstance,
    //             siteValue: site?.value
    //         });
    //         return;
    //     }

    //     setIsLoadingData(true);
    //     try {
    //         const response = await axios.get<HeatmapResponse>(
    //             `${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${site.value}&page_url=${selectedPage.value}`,
    //             {
    //                 withCredentials: true,
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                 }
    //             }
    //         );

    //         console.log('Received heatmap data:', response.data);

    //         if (!response.data.points || response.data.points.length === 0) {
    //             heatmapInstance.setData({ data: [], max: 1, min: 0 });
    //             return;
    //         }

    //         const formattedData = {
    //             max: response.data.maxCount || Math.max(...response.data.points.map(p => p.count)),
    //             min: 0,
    //             data: response.data.points.map(point => ({
    //                 x: point.x,
    //                 y: point.y,
    //                 value: point.count
    //             }))
    //         };

    //         console.log('Formatted data:', formattedData);
    //         heatmapInstance.setData(formattedData);
    //         updateHeatmapSize();

    //     } catch (error) {
    //         console.error('Error fetching heatmap data:', error);
    //     } finally {
    //         setIsLoadingData(false);
    //     }
    // }, [selectedPage, site?.value, heatmapInstance, updateHeatmapSize]);

    const fetchHeatmapData = useCallback(async () => {
        let instance = heatmapInstance;
        if (!instance) {
            instance = initHeatmap();
            if (!instance) {
                console.error('Не удалось инициализировать тепловую карту');
                return;
            }
        }

        if (!selectedPage?.value || !site?.value) {
            console.log('Отсутствуют необходимые данные');
            return;
        }

        setIsLoadingData(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${site.value}&page_url=${selectedPage.value}`;
            console.log('Отправляем запрос по URL:', url);

            const result = await axios.get<HeatmapResponse>(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Получены данные:', result.data);

            if (result.data.points && result.data.points.length > 0) {
                const formattedPoints = result.data.points.map(point => ({
                    x: point.x,
                    y: point.y,
                    value: point.count
                }));

                console.log('Применяем данные к тепловой карте:', {
                    pointsCount: formattedPoints.length,
                    maxValue: result.data.maxCount
                });

                instance.setData({
                    max: result.data.maxCount,
                    min: 0,
                    data: formattedPoints
                });
            } else {
                console.log('Нет данных для отображения');
                instance.setData({ data: [], max: 1, min: 0 });
            }
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            setIsLoadingData(false);
        }
    }, [selectedPage?.value, site?.value, heatmapInstance, initHeatmap]);

    // Обновление размера при изменении страницы
    useEffect(() => {
        if (selectedPage) {
            const timer = setTimeout(() => {
                updateHeatmapSize();
                fetchHeatmapData();
            }, 1000); // Даем время на загрузку iframe

            return () => clearTimeout(timer);
        }
    }, [selectedPage, updateHeatmapSize, fetchHeatmapData]);

    // Обработчик изменения размера окна
    useEffect(() => {
        const handleResize = () => {
            updateHeatmapSize();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateHeatmapSize]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (heatmapInstance) {
                heatmapInstance.setData({ data: [], max: 1, min: 0 });
            }
        };
    }, [heatmapInstance]);

    return {
        isLoadingData,
        heatmapInstance,
        containerRef,
        iframeRef,
        updateHeatmapSize,
        fetchHeatmapData
    };
};
