import { useState, useEffect } from 'react';
import { UMAP } from 'umap-js';
import { UMAPPoint, UMAPUserEvent } from './UmapTypes';
import { prepareDataForUMAP, tempData } from './utils/data-utils';
import { DataControls } from './DataControls';
import { UmapChart } from './UmapChart';
import { AnalysisResults } from './AnalysisResults';
import './umap.css';
import { useSiteContext } from '../../../../utils/SiteContext';
import { getAPI } from '../../../../utils/axiosGet';

type UserSegment =
    | 'новичок'
    | 'заинтересованный'
    | 'вовлеченный'
    | 'отказник'
    | 'проходимец';

export const UmapAnalysis = ({ webId }: { webId: number }) => {
    const [umapData, setUmapData] = useState<UMAPPoint[]>([]);
    const [filteredData, setFilteredData] = useState<UMAPPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [colorBy, setColorBy] = useState<'eventType' | 'time' | 'page' | 'segment'>('eventType');
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
    });
    const [userSegments, setUserSegments] = useState<Record<string, UserSegment>>({});
    const [selectedPoint, setSelectedPoint] = useState<UMAPPoint | null>(null);

    const classifyUsers = (events: UMAPUserEvent[]): Record<string, UserSegment> => {
        const sessions: Record<string, UMAPUserEvent[]> = {};

        events.forEach(event => {
            if (!sessions[event.session_id]) {
                sessions[event.session_id] = [];
            }
            sessions[event.session_id].push(event);
        });

        const segments: Record<string, UserSegment> = {};

        Object.entries(sessions).forEach(([sessionId, sessionEvents]) => {
            const eventCount = sessionEvents.length;
            const hasClicks = sessionEvents.some(e => e.event_id === 4);
            const hasScrolls = sessionEvents.some(e => e.event_id !== 4);
            const duration = new Date(sessionEvents[sessionEvents.length - 1].timestamp).getTime() -
                new Date(sessionEvents[0].timestamp).getTime();

            if (eventCount < 3) {
                segments[sessionId] = 'отказник';
            } else if (eventCount >= 3 && eventCount < 10) {
                segments[sessionId] = 'новичок';
            } else if (eventCount >= 10 && eventCount < 20) {
                segments[sessionId] = 'заинтересованный';
            } else {
                segments[sessionId] = 'вовлеченный';
            }
        });

        return segments;
    };

    useEffect(() => {
        const fetchAndProcessUmapData = async () => {
            try {
                if (!webId) {
                    setError('Web ID не указан');
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                setError(null);

                const params = new URLSearchParams();
                params.append('web_id', webId.toString());

                if (dateRange.start) {
                    params.append('start_date', dateRange.start.toISOString());
                }
                if (dateRange.end) {
                    params.append('end_date', dateRange.end.toISOString());
                }

                const response = await getAPI.get<UMAPUserEvent[]>(`/events/clustering/umap?${params.toString()}`);

                if (!response.data || response.data.length === 0) {
                    setError('Нет данных для выбранного периода');
                    return;
                }

                const segments = classifyUsers(response.data);
                setUserSegments(segments);

                const preparedData = prepareDataForUMAP(response.data);
                const umap = new UMAP({
                    nComponents: 2,
                    nNeighbors: Math.min(15, response.data.length - 1),
                    minDist: 0.1,
                    spread: 1.0
                });

                const embedding = umap.fit(preparedData);

                const result: UMAPPoint[] = response.data.map((event, i) => ({
                    x: embedding[i][0],
                    y: embedding[i][1],
                    label: `Событие ${event.event_id} (${event.page_url.split('/').pop()})`,
                    timestamp: event.timestamp,
                    eventType: event.event_id === 4 ? 'scroll' : 'click',
                    pageUrl: event.page_url,
                    rawData: event,
                    sessionId: event.session_id,
                    userSegment: segments[event.session_id] || 'новичок'
                }));

                setUmapData(result);
                setFilteredData(result);
            } catch (err) {
                console.error('Ошибка обработки UMAP:', err);
                setError('Ошибка при обработке данных');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndProcessUmapData();
    }, [webId, dateRange]);

    useEffect(() => {
        if (umapData.length > 0 && dateRange.start && dateRange.end) {
            const filtered = umapData.filter(point => {
                const pointDate = new Date(point.timestamp);
                return pointDate >= dateRange.start! && pointDate <= dateRange.end!;
            });
            setFilteredData(filtered);
        }
    }, [dateRange, umapData]);

    const handlePointClick = (point: UMAPPoint) => {
        setSelectedPoint(point);
    };

    const closeModal = () => {
        setSelectedPoint(null);
    };

    if (isLoading) return <div className="loading">Загрузка анализа данных...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="umap-container">
            <h1 className="umap-header">Анализ пользовательских событий с UMAP</h1>

            <DataControls
                colorBy={colorBy}
                setColorBy={setColorBy}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            <div className="umap-chart-container">
                <UmapChart
                    data={filteredData}
                    colorBy={colorBy}
                    userSegments={userSegments}
                    onPointClick={handlePointClick}
                />
            </div>

            <AnalysisResults
                data={filteredData}
                userSegments={userSegments}
            />

            <div className="interpretation">
                <h3>Как интерпретировать результаты:</h3>
                <ul>
                    <li><strong>Близкие точки</strong> - схожие события по характеристикам</li>
                    <li><strong>Цвета</strong> - показывают выбранную категоризацию</li>
                    <li><strong>Кластеры</strong> - группы схожих событий</li>
                    <li><strong>Выбросы</strong> - необычные или аномальные события</li>
                </ul>
            </div>

            {selectedPoint && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="modal-close" onClick={closeModal}>&times;</span>
                        <h2>Детали события</h2>
                        <p><strong>Тип:</strong> {selectedPoint.eventType === 'scroll' ? 'Прокрутка' : 'Клик'}</p>
                        <p><strong>Время:</strong> {new Date(selectedPoint.timestamp).toLocaleString()}</p>
                        <p><strong>Страница:</strong> {selectedPoint.pageUrl}</p>
                        <p><strong>Сегмент:</strong> {selectedPoint.userSegment}</p>
                        <p><strong>Координаты:</strong> ({selectedPoint.x.toFixed(2)}, {selectedPoint.y.toFixed(2)})</p>
                    </div>
                </div>
            )}
        </div>
    );
};