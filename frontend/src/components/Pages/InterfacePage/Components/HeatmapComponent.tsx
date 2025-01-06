import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import axios from 'axios';
// import './HeatmapPage.css';
import h337 from 'heatmap.js';
import type { Heatmap, DataPoint } from 'heatmap.js';
import { User } from '../../../../models/user.model';
import { WebSite } from '../../../../models/site.model';
import { ClickData, HeatmapData, PageData, RawEvent } from '../../../../models/event.model';

type HeatmapInstance = Heatmap<'value', 'x', 'y'>;

interface HeatmapComponentProps {
    user: User | null;
    loading: boolean;
}

interface PageOption {
    value: string;
    label: string;
}

interface EventData {
    duration?: number;
    scrollTop?: number;
    scrollPercentage?: number;
    x?: number;
    y?: number;
}

interface HeatmapPoint {
    x: number;
    y: number;
    value: number;
}

const HeatmapComponent: React.FC<HeatmapComponentProps> = ({ user, loading }) => {
    const [selectedPage, setSelectedPage] = useState<PageOption | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [pages, setPages] = useState<PageOption[]>([]);
    const [heatmapInstance, setHeatmapInstance] = useState<Heatmap<'value', 'x', 'y'> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const savedSite = localStorage.getItem('selectedSite');
    const site = savedSite ? JSON.parse(savedSite) : null;

    const fetchPages = useCallback(async () => {
        if (!site?.value) return;

        try {
            const response = await axios.get<string[]>(
                `${process.env.REACT_APP_API_URL}/events/pages`,
                {
                    params: { web_id: site.value },
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            const pageOptions = response.data.map(page => ({
                value: page,
                label: page
            }));
            setPages(pageOptions);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    }, [site?.value]);


    // const fetchHeatmapData = useCallback(async () => {
    //     if (!selectedPage || !heatmapInstance || !site?.value) return;

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

    //         console.log('Received heatmap data:', response.data);

    //         const points = response.data.map(item => ({
    //             x: item.eventData.x,
    //             y: item.eventData.y,
    //             value: item.clickCount
    //         }));

    //         const maxValue = Math.max(...points.map(p => p.value));

    //         heatmapInstance.setData({
    //             max: maxValue || 1,
    //             min: 0,
    //             data: points
    //         });
    //     } catch (error) {
    //         console.error('Error fetching heatmap data:', error);
    //     }
    // }, [selectedPage, heatmapInstance, site?.value]);

    const fetchHeatmapData = useCallback(async () => {
        if (!selectedPage || !heatmapInstance || !site?.value) return;

        setIsLoadingData(true);
        try {
            const response = await axios.get<HeatmapData[]>(
                `${process.env.REACT_APP_API_URL}/events/click-heatmap`,
                {
                    params: {
                        web_id: site.value,
                        page_url: selectedPage.value
                    },
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            console.log('Received heatmap data:', response.data);

            const points = response.data.map(item => ({
                x: Math.round(item.eventData.x),
                y: Math.round(item.eventData.y),
                value: item.clickCount
            }));

            console.log('Processed points:', points);

            if (points.length > 0) {
                heatmapInstance.setData({
                    max: Math.max(...points.map(p => p.value)),
                    min: 0,
                    data: points
                });
            } else {
                console.log('No points to display');
            }
        } catch (error) {
            console.error('Error fetching heatmap data:', error);
        } finally {
            setIsLoadingData(false);
        }
    }, [selectedPage, heatmapInstance, site?.value]);




    useEffect(() => {
        fetchPages();
    }, [fetchPages]);


    useEffect(() => {
        if (containerRef.current && !heatmapInstance) {
            const instance = h337.create({
                container: containerRef.current,
                radius: 30,
                maxOpacity: 0.9,
                minOpacity: 0.1,
                blur: 0.75,
                gradient: {
                    '.5': 'blue',
                    '.8': 'red',
                    '.95': 'white'
                }
            });
            setHeatmapInstance(instance);
        }

        return () => {
            if (heatmapInstance) {
                setHeatmapInstance(null);
            }
        };
    }, []);


    useEffect(() => {
        fetchHeatmapData();
    }, [fetchHeatmapData]);

    const handlePageChange = (option: PageOption | null) => {
        setSelectedPage(option);
        if (heatmapInstance) {
            heatmapInstance.setData({ data: [], max: 1, min: 0 });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in</div>;
    if (!site) return <div>Please select a site first</div>;
    


    

    return (
        <div className="heatmap-page">

            <div className="heatmap-controls">
                <h2>Тепловая карта кликов</h2>
                <div className="page-select-container">
                    <label>Выберите страницу:</label>
                    <Select<PageOption>
                        value={selectedPage}
                        onChange={handlePageChange}
                        options={pages}
                        className="page-select"
                        placeholder="Выберите страницу"
                        isDisabled={!site || pages.length === 0 || isLoadingData}
                    />
                </div>
                {isLoadingData && <div className="loading-indicator">Загрузка данных...</div>}
            </div>

            <div className="heatmap-content">
                <div className="heatmap-visualization">
                    <div
                        className="heatmap-container"
                        style={{
                            width: '100%',
                            height: 'calc(100vh - 200px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {selectedPage ? (
                            <>
                                <iframe
                                    src={selectedPage.value}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        zIndex: 1
                                    }}
                                    title="Page preview"
                                />
                                <div
                                    ref={containerRef}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 2,
                                        pointerEvents: 'none',
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </>
                        ) : (
                            <div className="no-page-selected">
                                Выберите страницу для отображения тепловой карты
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default HeatmapComponent;
