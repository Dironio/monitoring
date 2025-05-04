import './tsne.css';
import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { UMAP } from 'umap-js';


ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface EventData {
    duration?: number;
    scrollTop?: number;
    scrollPercentage?: number;
    x?: number;
    y?: number;
    id?: null;
    tag?: string;
    text?: string;
    classes?: string;
}

interface UserEvent {
    id: number;
    user_id: number;
    event_data: EventData;
    page_url: string;
    timestamp: string;
    web_id: number;
    session_id: string;
    event_id: number;
    created_at: string;
    updated_at: string;
}


// Временные данные
const tempData: UserEvent[] = [
    {
        id: 25390,
        user_id: 5,
        event_data: {
            duration: 1538,
            scrollTop: 3223,
            scrollPercentage: 100
        },
        page_url: "http://localhost:3000/models/sequence",
        timestamp: "2025-05-03 00:13:21.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 4,
        created_at: "2025-05-03 00:13:20.763 +0500",
        updated_at: "2025-05-03 00:13:20.763 +0500"
    },
    {
        id: 25389,
        user_id: 5,
        event_data: {
            duration: 1536,
            scrollTop: 2300,
            scrollPercentage: 71.36
        },
        page_url: "http://localhost:3000/models/sequence",
        timestamp: "2025-05-03 00:13:18.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 4,
        created_at: "2025-05-03 00:13:18.368 +0500",
        updated_at: "2025-05-03 00:13:18.368 +0500"
    },
    {
        id: 25388,
        user_id: 5,
        event_data: {
            x: 499,
            y: 123,
            id: null,
            tag: "BUTTON",
            text: "Анализ последовательностей",
            classes: "nav-item selected",
            duration: 1446
        },
        page_url: "http://localhost:3000/models/sequence",
        timestamp: "2025-05-03 00:11:48.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 2,
        created_at: "2025-05-03 00:11:48.198 +0500",
        updated_at: "2025-05-03 00:11:48.198 +0500"
    },
    {
        id: 25387,
        user_id: 5,
        event_data: {
            x: 686,
            y: 116,
            id: null,
            tag: "BUTTON",
            text: "Метрики сходства",
            classes: "nav-item selected",
            duration: 1438
        },
        page_url: "http://localhost:3000/models/similarity",
        timestamp: "2025-05-03 00:11:39.000 +0500",
        web_id: 1,
        session_id: "1yuxhyea9eh",
        event_id: 2,
        created_at: "2025-05-03 00:11:39.503 +0500",
        updated_at: "2025-05-03 00:11:39.503 +0500"
    }
];

const normalizeData = (value: number, min: number, max: number): number => {
    if (max === min) return 0.5;
    return (value - min) / (max - min);
};

// Подготовка данных (адаптированная для UMAP)
const prepareDataForUMAP = (events: UserEvent[]): number[][] => {
    const allFeatures = events.map(event => {
        const data = event.event_data;
        return [
            data.duration || 0,
            data.scrollTop || 0,
            data.scrollPercentage || 0,
            data.x || 0,
            data.y || 0,
            event.event_id,
            new Date(event.timestamp).getTime() / 1000
        ];
    });

    const featureRanges = allFeatures[0].map((_, i) => {
        const values = allFeatures.map(f => f[i]);
        return {
            min: Math.min(...values),
            max: Math.max(...values)
        };
    });

    return allFeatures.map(features =>
        features.map((value, i) =>
            normalizeData(value, featureRanges[i].min, featureRanges[i].max)
        )
    );
};

const TSNEAnalysisPage: React.FC = () => {
    const [umapData, setUmapData] = useState<{ x: number, y: number, label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [analysisResults, setAnalysisResults] = useState<string[]>([]);

    useEffect(() => {
        const runUMAP = () => {
            try {
                console.log('Подготовка данных...'); // Логирование
                const preparedData = prepareDataForUMAP(tempData);
                console.log('Данные подготовлены:', preparedData); // Проверка данных

                const umap = new UMAP({
                    nComponents: 2,
                    nNeighbors: Math.min(15, preparedData.length - 1), // Корректировка для малых наборов
                    minDist: 0.1,
                    spread: 1.0,
                    random: Math.random
                });

                console.log('Запуск UMAP...');
                const embedding = umap.fit(preparedData);
                console.log('UMAP завершен, результат:', embedding); // Проверка результата

                const plotData = embedding.map((point: number[], i: number) => ({
                    x: point[0],
                    y: point[1],
                    label: `Event ${tempData[i].event_id} (${tempData[i].page_url.split('/').pop()})`
                }));

                console.log('Данные для графика:', plotData); // Проверка данных графика
                setUmapData(plotData);

                // Простая заглушка для анализа
                setAnalysisResults([
                    `Всего точек: ${plotData.length}`,
                    `Первая точка: X=${plotData[0]?.x.toFixed(2)}, Y=${plotData[0]?.y.toFixed(2)}`,
                    `Последняя точка: X=${plotData[plotData.length - 1]?.x.toFixed(2)}, Y=${plotData[plotData.length - 1]?.y.toFixed(2)}`
                ]);
            } catch (error) {
                console.error('UMAP Error:', error);
                setAnalysisResults([`Ошибка: ${error}`]);
            } finally {
                setIsLoading(false);
            }
        };

        runUMAP();
    }, []);


    // Функция для анализа результатов t-SNE
    const analyzeResults = (embeddings: { x: number, y: number, label: string }[], originalData: UserEvent[]) => {
        const results: string[] = [];

        // 1. Анализ кластеризации
        const distances: number[] = [];
        for (let i = 0; i < embeddings.length; i++) {
            for (let j = i + 1; j < embeddings.length; j++) {
                const dx = embeddings[i].x - embeddings[j].x;
                const dy = embeddings[i].y - embeddings[j].y;
                distances.push(Math.sqrt(dx * dx + dy * dy));
            }
        }

        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        results.push(`Среднее расстояние между точками: ${avgDistance.toFixed(4)}`);

        // 2. Анализ по типам событий
        const eventTypes = new Map<number, number[]>();
        originalData.forEach((event, i) => {
            if (!eventTypes.has(event.event_id)) {
                eventTypes.set(event.event_id, []);
            }
            eventTypes.get(event.event_id)?.push(i);
        });

        eventTypes.forEach((indices, eventId) => {
            if (indices.length > 1) {
                // Вычисляем центроид для событий этого типа
                let centerX = 0, centerY = 0;
                indices.forEach(i => {
                    centerX += embeddings[i].x;
                    centerY += embeddings[i].y;
                });
                centerX /= indices.length;
                centerY /= indices.length;

                // Вычисляем радиус кластера (среднее расстояние до центроида)
                let radius = 0;
                indices.forEach(i => {
                    const dx = embeddings[i].x - centerX;
                    const dy = embeddings[i].y - centerY;
                    radius += Math.sqrt(dx * dx + dy * dy);
                });
                radius /= indices.length;

                results.push(`События типа ${eventId} образуют кластер с радиусом ${radius.toFixed(4)}`);
            }
        });

        // 3. Анализ временных паттернов
        const timeStamps = originalData.map(event => new Date(event.timestamp).getTime());
        const minTime = Math.min(...timeStamps);
        const maxTime = Math.max(...timeStamps);

        // Проверяем корреляцию между временем и положением на t-SNE
        const timePositions = embeddings.map((point, i) => ({
            time: (timeStamps[i] - minTime) / (maxTime - minTime),
            x: point.x,
            y: point.y
        }));

        // Вычисляем корреляцию Пирсона
        const pearsonCorrelation = (x: number[], y: number[]) => {
            const n = x.length;
            const sumX = x.reduce((a, b) => a + b, 0);
            const sumY = y.reduce((a, b) => a + b, 0);
            const sumXY = x.map((val, i) => val * y[i]).reduce((a, b) => a + b, 0);
            const sumX2 = x.map(val => val * val).reduce((a, b) => a + b, 0);
            const sumY2 = y.map(val => val * val).reduce((a, b) => a + b, 0);

            const numerator = sumXY - (sumX * sumY) / n;
            const denominator = Math.sqrt((sumX2 - (sumX * sumX) / n) * (sumY2 - (sumY * sumY) / n));

            return denominator === 0 ? 0 : numerator / denominator;
        };

        const timeXCorr = pearsonCorrelation(
            timePositions.map(p => p.time),
            timePositions.map(p => p.x)
        );

        const timeYCorr = pearsonCorrelation(
            timePositions.map(p => p.time),
            timePositions.map(p => p.y)
        );

        results.push(`Корреляция времени и X-координаты: ${timeXCorr.toFixed(4)}`);
        results.push(`Корреляция времени и Y-координаты: ${timeYCorr.toFixed(4)}`);

        setAnalysisResults(results);
    };

    return (
        <div className="event-analysis">
            <h1 className="event-analysis__title">Анализ пользовательских событий с t-SNE</h1>

            <div className="event-analysis__methodology">
                <h2 className="event-analysis__subtitle">Методология анализа</h2>
                <ul className="event-analysis__list">
                    <li className="event-analysis__list-item">t-SNE (t-distributed Stochastic Neighbor Embedding) - алгоритм визуализации многомерных данных</li>
                    <li className="event-analysis__list-item">Используется метрика Евклидова расстояния для вычисления сходства между точками</li>
                    <li className="event-analysis__list-item">Перплексия установлена на 10 (оптимально для небольших наборов данных)</li>
                    <li className="event-analysis__list-item">Данные нормализованы перед обработкой для равного вклада каждого признака</li>
                    <li className="event-analysis__list-item">Анализируются кластеры событий, временные паттерны и корреляции</li>
                </ul>
            </div>

            {isLoading ? (
                <div className="event-analysis__loading">Загрузка и анализ данных...</div>
            ) : (
                <>
                    <div className="event-analysis__visualization">
                        <h2 className="event-analysis__subtitle">Визуализация UMAP</h2>
                        <div className="event-analysis__chart">
                            <Scatter
                                data={{
                                    datasets: [{
                                        label: 'Пользовательские события',
                                        data: umapData,
                                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                                        pointRadius: 8,
                                    }]
                                }}
                                options={{
                                    scales: {
                                        x: { title: { display: true, text: 'UMAP измерение 1' } },
                                        y: { title: { display: true, text: 'UMAP измерение 2' } }
                                    },
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => umapData[context.dataIndex].label
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="event-analysis__results">
                        <h2 className="event-analysis__subtitle">Результаты анализа</h2>
                        <div className="event-analysis__results-container">
                            <ul className="event-analysis__results-list">
                                {analysisResults.map((result, i) => (
                                    <li key={i} className="event-analysis__results-item">{result}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="event-analysis__interpretation">
                        <h2 className="event-analysis__subtitle">Интерпретация результатов</h2>
                        <div className="event-analysis__interpretation-container">
                            <div className="event-analysis__interpretation-section">
                                <h3 className="event-analysis__interpretation-title">1. Кластеризация событий</h3>
                                <p className="event-analysis__interpretation-text">
                                    Алгоритм t-SNE стремится сохранить локальные расстояния между точками.
                                    Близко расположенные точки на графике соответствуют событиям с похожими характеристиками.
                                </p>
                            </div>

                            <div className="event-analysis__interpretation-section">
                                <h3 className="event-analysis__interpretation-title">2. Временные паттерны</h3>
                                <p className="event-analysis__interpretation-text">
                                    Корреляция между временем события и его положением на карте помогает выявить
                                    временные зависимости в поведении пользователей.
                                </p>
                            </div>

                            <div className="event-analysis__interpretation-section">
                                <h3 className="event-analysis__interpretation-title">3. Анализ выбросов</h3>
                                <p className="event-analysis__interpretation-text">
                                    События, значительно удаленные от основных кластеров, могут представлять
                                    аномальное поведение или особые сценарии взаимодействия.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TSNEAnalysisPage;