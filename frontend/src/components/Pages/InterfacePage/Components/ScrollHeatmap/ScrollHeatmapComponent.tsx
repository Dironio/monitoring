import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import './ScrollHeatmap.css';
import { useSiteContext } from '../../../../utils/SiteContext';

interface ScrollPoint {
    event_data: {
        scrollTop: number;
        scrollPercentage: number;
        duration: number;
    };
    scroll_count: number;
}

interface HeatmapResponse {
    points: ScrollPoint[];
    maxCount: number | null;
}

const ScrollHeatmap: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState(false);
    const [overlayHeight, setOverlayHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [maxCount, setMaxCount] = useState<number>(0);

    const handleIframeLoad = useCallback(() => {
        if (iframeRef.current) {
            const height = iframeRef.current.contentWindow?.document.documentElement.scrollHeight || 0;
            setOverlayHeight(height);
        }
    }, []);

    // const getHeatColor = (scrollCount: number, maxCount: number) => {
    //     const ratio = scrollCount / maxCount;
    //     const hue = 240 - (ratio * 240);
    //     const saturation = 80 + (ratio * 20);
    //     const lightness = 50;
    //     return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
    // };

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

            if (response.data.points && Array.isArray(response.data.points)) {
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

    const createGradientStops = () => {
        return `
            rgba(255, 0, 0, 0.8) 0%,    // красный сверху
            rgba(255, 255, 0, 0.6) 25%, // желтый
            rgba(0, 255, 0, 0.5) 50%,   // зеленый
            rgba(0, 255, 255, 0.4) 75%, // голубой
            rgba(0, 0, 255, 0.3) 100%   // синий снизу
        `;
    };


    const getGradientColor = (percentage: number) => {
        // От красного (сверху) до синего (снизу)
        if (percentage <= 20) return "255, 0, 0"; // красный
        if (percentage <= 40) return "255, 165, 0"; // оранжевый
        if (percentage <= 60) return "0, 255, 0"; // зеленый
        if (percentage <= 80) return "0, 255, 255"; // голубой
        return "0, 0, 255"; // синий
    };

    // const getColorIntensity = (count: number) => {
    //     if (!heatmapData?.maxCount) return 0;
    //     return count / heatmapData.maxCount;
    // };

    const aggregatedData = useMemo(() => {
        const segments = 100;
        const segmentSize = 100 / segments;
        const aggregatedData = new Array(segments).fill(0).map((_, index) => ({
            startPercent: index * segmentSize,
            endPercent: (index + 1) * segmentSize,
            count: 0
        }));

        if (heatmapData?.points) {
            heatmapData.points.forEach((point: ScrollPoint) => {
                const segment = Math.floor(point.event_data.scrollPercentage / segmentSize);
                if (segment >= 0 && segment < segments) {
                    aggregatedData[segment].count += point.scroll_count;
                }
            });
        }

        return aggregatedData;
    }, [heatmapData]);

    const getHeatMapColor = (value: number) => {
        // value от 0 до 1
        // Определяем градиент от синего (мало скроллов) к красному (много скроллов)
        const blue = [0, 0, 255];    // RGB для синего
        const green = [0, 255, 0];   // RGB для зеленого
        const red = [255, 0, 0];     // RGB для красного

        let rgb;

        if (value <= 0.5) {
            // От синего к зеленому
            const percent = value * 2;
            rgb = blue.map((start, i) =>
                Math.round(start + (green[i] - start) * percent)
            );
        } else {
            // От зеленого к красному
            const percent = (value - 0.5) * 2;
            rgb = green.map((start, i) =>
                Math.round(start + (red[i] - start) * percent)
            );
        }

        return rgb.join(', ');
    }

    useEffect(() => {
        if (selectedSite && selectedPage) {
            fetchHeatmapData();
        }
    }, [selectedSite, selectedPage]);

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

                        {heatmapData && heatmapData.points && heatmapData.points.length > 0 && (
                            <div
                                className="heatmap-overlay"
                                style={{ height: `${overlayHeight}px` }}
                            >
                                {(() => {
                                    const maxCount = Math.max(...heatmapData.points.map(point => point.scroll_count));
                                    return heatmapData.points.map((point, index) => {
                                        // Вычисляем процент от максимального количества скроллов
                                        const intensity = point.scroll_count / maxCount;
                                        // Получаем цвет на основе интенсивности
                                        const color = getHeatMapColor(intensity);

                                        return (
                                            <div
                                                key={index}
                                                className="heatmap-band"
                                                style={{
                                                    top: `${point.event_data.scrollPercentage}%`,
                                                    right: 0,
                                                    width: '30px',
                                                    height: '4px',
                                                    background: `rgba(${color}, 0.7)`,
                                                    transition: 'all 0.3s ease'
                                                }}
                                                title={`Позиция: ${point.event_data.scrollPercentage.toFixed(1)}%
Количество скроллов: ${point.scroll_count}
Максимум скроллов: ${maxCount}
Интенсивность: ${(intensity * 100).toFixed(1)}%`}
                                            />
                                        );
                                    });
                                })()}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="no-selection-message">
                        Выберите сайт и страницу для построения тепловой карты
                    </div>
                )}
            </div>

            <div className="legend-container">
                <div className="legend-content">
                    <div className="legend-gradient" />
                    <div className="legend-labels">
                        <span>Низкая интенсивность</span>
                        <span>Высокая интенсивность</span>
                    </div>
                    {heatmapData?.maxCount && (
                        <div className="legend-count">
                            Максимальное количество скроллов: {heatmapData.maxCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScrollHeatmap;
