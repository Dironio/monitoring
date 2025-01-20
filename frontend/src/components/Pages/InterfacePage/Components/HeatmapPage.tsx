import React, { useEffect, useRef, useState } from 'react';
import './heatmap.css'
import HeatmapVisualization, { ClickHeatmapData } from './HeatmapVisual';
import axios from 'axios';
import { User } from '../../../../models/user.model';
import { useSiteContext } from '../../../utils/SiteContext';

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


const HeatmapPage: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [heatmapData, setHeatmapData] = useState<ClickHeatmapData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDots, setShowDots] = useState(false);
    const [debugMode, setDebugMode] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState({ x: 1, y: 1 });
    const [maxClicks, setMaxClicks] = useState(0);

    const getPointColor = (clicks: number) => {
        // Нормализуем количество кликов от 0 до 1
        const normalized = clicks / maxClicks;

        // Градиент от холодного к теплому
        if (normalized < 0.2) return 'rgb(0, 150, 255)';      // Холодный синий
        if (normalized < 0.4) return 'rgb(0, 255, 255)';      // Циан
        if (normalized < 0.6) return 'rgb(0, 255, 150)';      // Бирюзовый
        if (normalized < 0.8) return 'rgb(255, 150, 0)';      // Оранжевый
        return 'rgb(255, 0, 0)';                              // Горячий красный
    };

    const getPointSize = (clicks: number) => {
        const baseSize = 16; // Базовый размер точки
        const maxSize = 24;  // Максимальный размер точки
        const size = baseSize + (clicks / maxClicks) * (maxSize - baseSize);
        return `${size}px`;
    };

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

            console.log('Исходные данные:', response.data);

            // Преобразуем данные в нужный формат
            const formattedData = response.data.points.map(point => ({
                eventData: {
                    x: Number(point.x),
                    y: Number(point.y)
                },
                clickCount: Number(point.count)
            }));

            console.log('Отформатированные данные:', formattedData);
            setHeatmapData(formattedData);

        } catch (error) {
            console.error('Error fetching heatmap data:', error);
            if (error) {
                console.log('Response data:', error);
                console.log('Response status:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (containerRef.current && heatmapData.length > 0) {
            const container = containerRef.current;
            const iframe = container.querySelector('iframe');

            if (iframe) {
                // Ждем загрузки iframe
                iframe.onload = () => {
                    const containerRect = container.getBoundingClientRect();
                    const iframeRect = iframe.getBoundingClientRect();

                    // Находим максимальные координаты из данных
                    const maxX = Math.max(...heatmapData.map(point => point.eventData.x));
                    const maxY = Math.max(...heatmapData.map(point => point.eventData.y));

                    // Вычисляем коэффициенты масштабирования
                    setScale({
                        x: iframeRect.width / maxX,
                        y: iframeRect.height / maxY
                    });

                    // Устанавливаем максимальное количество кликов
                    setMaxClicks(Math.max(...heatmapData.map(point => point.clickCount)));
                };
            }
        }
    }, [heatmapData]);

    // Проверяем наличие данных и выводим в консоль
    useEffect(() => {
        console.log('Текущие данные:', heatmapData);
        console.log('Количество точек:', heatmapData.length);
    }, [heatmapData]);

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
                    onClick={() => setShowDots(!showDots)}
                    className="toggle-dots-btn"
                    disabled={!heatmapData || heatmapData.length === 0}
                >
                    {showDots ? 'Скрыть точки' : 'Показать точки'}
                </button>
                <button
                    onClick={() => setDebugMode(!debugMode)}
                    className="toggle-dots-btn"
                    disabled={!heatmapData || heatmapData.length === 0}
                >
                    {debugMode ? 'Режим просмотра' : 'Режим отладки'}
                </button>
            </div>

            <div className="page-container" ref={containerRef}>
                {!debugMode && (
                    <iframe
                        src={selectedPage?.value}
                        style={{
                            width: '100%',
                            height: 'calc(100vh - 100px)',
                            position: 'relative',
                            pointerEvents: 'none'
                        }}
                    />
                )}
                {showDots && heatmapData && heatmapData.length > 0 && (
                    <div className={`dots-overlay ${debugMode ? 'debug-mode' : ''}`}>
                        {heatmapData.map((point, index) => (
                            <div
                                key={index}
                                className="click-dot"
                                style={{
                                    left: `${point.eventData.x * scale.x}px`,
                                    top: `${point.eventData.y * scale.y}px`,
                                    backgroundColor: getPointColor(point.clickCount),
                                    width: getPointSize(point.clickCount),
                                    height: getPointSize(point.clickCount),
                                    opacity: 0.7 + (point.clickCount / maxClicks) * 0.3
                                }}
                                title={`Координаты: (${point.eventData.x}, ${point.eventData.y}), Клики: ${point.clickCount}`}
                            />
                        ))}
                    </div>
                )}

                {/* Добавляем легенду */}
                {showDots && heatmapData.length > 0 && (
                    <div className="heatmap-legend" style={{
                        position: 'absolute',
                        right: '20px',
                        top: '20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '10px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 1003
                    }}>
                        <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                            Количество кликов:
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                background: 'rgb(0, 150, 255)',
                                borderRadius: '50%'
                            }} />
                            <span style={{ fontSize: '11px' }}>Мало</span>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                background: 'rgb(255, 0, 0)',
                                borderRadius: '50%'
                            }} />
                            <span style={{ fontSize: '11px' }}>Много</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeatmapPage;