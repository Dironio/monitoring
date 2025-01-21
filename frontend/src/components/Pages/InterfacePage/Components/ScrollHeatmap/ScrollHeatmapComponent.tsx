import React, { useState, useEffect, useCallback, useRef } from 'react';
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

    const handleIframeLoad = useCallback(() => {
        if (iframeRef.current) {
            const height = iframeRef.current.contentWindow?.document.documentElement.scrollHeight || 0;
            setOverlayHeight(height);
            console.log('Iframe loaded, height:', height);
        }
    }, []);

    const getHeatColor = (scrollCount: number, maxCount: number) => {
        const normalized = scrollCount / maxCount;

        if (normalized < 0.2) return 'rgb(0, 150, 255)';      // Холодный синий
        if (normalized < 0.4) return 'rgb(0, 255, 255)';      // Циан
        if (normalized < 0.6) return 'rgb(0, 255, 150)';      // Бирюзовый
        if (normalized < 0.8) return 'rgb(255, 150, 0)';      // Оранжевый
        return 'rgb(255, 0, 0)';                              // Горячий красный
    };

    const fetchHeatmapData = async () => {
        if (!selectedSite || !selectedPage) {
            setError('Пожалуйста, выберите сайт и страницу');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log('Fetching scroll heatmap data for:', selectedPage.value);

            const url = `${process.env.REACT_APP_API_URL}/events/scroll-heatmap?web_id=${selectedSite.value}&page_url=${selectedPage.value}`;

            const response = await axios.get<HeatmapResponse>(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Исходные данные:', response.data);

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

    useEffect(() => {
        if (selectedSite && selectedPage) {
            fetchHeatmapData();
        }
    }, [selectedSite, selectedPage]);

    return (
        <div className="heatmap-container" ref={containerRef}>
            <div className="heatmap-content">
                <div className="header-section">
                    <h1 className="main-title">Карта скроллов</h1>
                    <div className="controls-container">
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
                            src={selectedPage.fullUrl} // Используем полный URL
                            className="page-preview"
                            onLoad={handleIframeLoad}
                            title="Page Preview"
                            style={{ width: '100%', height: '800px' }}
                        />

                        {heatmapData && heatmapData.points.length > 0 && heatmapData.maxCount && (
                            <div
                                className="heatmap-overlay"
                                style={{ height: `${overlayHeight}px` }}
                            >
                                {heatmapData.points.map((point, index) => (
                                    <div
                                        key={index}
                                        className="heatmap-band"
                                        style={{
                                            top: `${point.event_data.scrollPercentage}%`,
                                            backgroundColor: getHeatColor(point.scroll_count, heatmapData.maxCount || 1),
                                            opacity: 0.6
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="no-selection-message">
                        Выберите сайт и страницу для построения тепловой карты
                    </div>
                )}

                <div className="legend-container">
                    <h3>Легенда тепловой карты</h3>
                    <div className="legend-content">
                        <div className="legend-gradient" />
                        <span className="legend-text">
                            Низкая → Высокая интенсивность скроллинга
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollHeatmap;