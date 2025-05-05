import { useState, useEffect } from 'react';
import { UMAP } from 'umap-js';
import { UMAPPoint, UMAPUserEvent } from './UmapTypes';
import { prepareDataForUMAP } from './utils/data-utils';
import { DataControls } from './DataControls';
import { UmapChart } from './UmapChart';
import { AnalysisResults } from './AnalysisResults';
import './umap.css';
import { useSiteContext } from '../../../../utils/SiteContext';
import { getAPI } from '../../../../utils/axiosGet';

// Типы сегментов пользователей
type UserSegment =
    | 'новичок'
    | 'заинтересованный'
    | 'вовлеченный'
    | 'отказник'
    | 'проходимец';

export const UmapAnalysis = () => {
    const { selectedSite } = useSiteContext();
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

    // Улучшенная классификация пользователей на основе их поведения
    const classifyUsers = (events: UMAPUserEvent[]): Record<string, UserSegment> => {
        // Группируем события по сессиям
        const sessions: Record<string, UMAPUserEvent[]> = {};
        events.forEach(event => {
            if (!sessions[event.session_id]) {
                sessions[event.session_id] = [];
            }
            sessions[event.session_id].push(event);
        });

        const segments: Record<string, UserSegment> = {};

        Object.entries(sessions).forEach(([sessionId, sessionEvents]) => {
            // Сортируем события по времени
            sessionEvents.sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            const eventCount = sessionEvents.length;
            const clickEvents = sessionEvents.filter(e => e.event_id !== 4);
            const scrollEvents = sessionEvents.filter(e => e.event_id === 4);

            // Вычисляем продолжительность сессии в минутах
            const duration = (new Date(sessionEvents[sessionEvents.length - 1].timestamp).getTime() -
                new Date(sessionEvents[0].timestamp).getTime()) / (1000 * 60);

            // Вычисляем уникальные посещенные страницы
            const uniquePages = new Set(sessionEvents.map(e => e.page_url)).size;

            // Вычисляем интенсивность активности
            const activityIntensity = eventCount / (duration || 1); // событий в минуту

            // Определяем сегмент на основе комплексных показателей
            if (eventCount <= 2 || duration < 0.5) {
                segments[sessionId] = 'отказник'; // Быстрый отказ
            } else if (clickEvents.length === 0 && scrollEvents.length > 0) {
                segments[sessionId] = 'проходимец'; // Только скроллит, не взаимодействует
            } else if (eventCount >= 15 && uniquePages >= 3 && activityIntensity > 2) {
                segments[sessionId] = 'вовлеченный'; // Активно взаимодействует с сайтом
            } else if (eventCount >= 7 && uniquePages >= 2) {
                segments[sessionId] = 'заинтересованный'; // Проявляет интерес
            } else {
                segments[sessionId] = 'новичок'; // Базовое взаимодействие
            }
        });

        return segments;
    };

    useEffect(() => {
        const fetchAndProcessUmapData = async () => {
            try {
                if (!selectedSite) {
                    setError('Сайт не выбран');
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                setError(null);

                const params = new URLSearchParams();
                params.append('web_id', selectedSite.value.toString());

                if (dateRange.start) {
                    params.append('start_date', dateRange.start.toISOString());
                }
                if (dateRange.end) {
                    params.append('end_date', dateRange.end.toISOString());
                }

                const response = await getAPI.get<UMAPUserEvent[]>(`/events/clustering/umap?${params.toString()}`);

                if (!response.data || response.data.length === 0) {
                    setError('Нет данных для выбранного периода');
                    setIsLoading(false);
                    return;
                }

                // Классифицируем пользователей
                const segments = classifyUsers(response.data);
                setUserSegments(segments);

                // Подготавливаем данные и выполняем UMAP
                const preparedData = prepareDataForUMAP(response.data);

                // Настраиваем параметры UMAP в зависимости от объема данных
                const nNeighbors = Math.max(5, Math.min(15, Math.floor(response.data.length / 10)));

                const umap = new UMAP({
                    nComponents: 2,
                    nNeighbors,
                    minDist: 0.1,
                    spread: 1.0
                });

                const embedding = umap.fit(preparedData);

                // Формируем результат
                const result: UMAPPoint[] = response.data.map((event, i) => {
                    const pageTitle = event.page_url.split('/').pop() || event.page_url;
                    return {
                        x: embedding[i][0],
                        y: embedding[i][1],
                        label: `${event.event_id === 4 ? 'Прокрутка' : 'Клик'} (${pageTitle})`,
                        timestamp: event.timestamp,
                        eventType: event.event_id === 4 ? 'scroll' : 'click',
                        pageUrl: event.page_url,
                        rawData: event,
                        sessionId: event.session_id,
                        userSegment: segments[event.session_id] || 'новичок'
                    };
                });

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
    }, [selectedSite, dateRange]);

    // Фильтрация данных при изменении диапазона дат
    useEffect(() => {
        if (umapData.length > 0) {
            let filtered = [...umapData];

            if (dateRange.start && dateRange.end) {
                filtered = filtered.filter(point => {
                    const pointDate = new Date(point.timestamp);
                    return pointDate >= dateRange.start! && pointDate <= dateRange.end!;
                });
            }

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
    if (!selectedSite) return <div className="error">Выберите сайт для анализа</div>;

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
                <h4>Описание сегментов пользователей:</h4>
                <ul>
                    <li><strong>Отказник</strong> - пользователь, который быстро покинул сайт (менее 30 секунд или 1-2 события)</li>
                    <li><strong>Проходимец</strong> - пользователь, который только скроллит, но не кликает (пассивное поведение)</li>
                    <li><strong>Новичок</strong> - пользователь с минимальным взаимодействием (3-6 событий)</li>
                    <li><strong>Заинтересованный</strong> - пользователь, который активно просматривает несколько страниц</li>
                    <li><strong>Вовлеченный</strong> - пользователь с высокой активностью и глубоким взаимодействием</li>
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
                        <p><strong>Сегмент пользователя:</strong> {selectedPoint.userSegment}</p>
                        <p><strong>ID сессии:</strong> {selectedPoint.sessionId}</p>
                        <p><strong>Координаты UMAP:</strong> ({selectedPoint.x.toFixed(2)}, {selectedPoint.y.toFixed(2)})</p>

                        <h3>Данные события:</h3>
                        <pre>{JSON.stringify(selectedPoint.rawData, null, 2)}</pre>

                        <button
                            className="view-session-button"
                            onClick={() => {
                                // Можно добавить код для получения всех событий сессии
                                console.log(`Просмотр сессии: ${selectedPoint.sessionId}`);
                            }}
                        >
                            Просмотреть все события сессии
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};