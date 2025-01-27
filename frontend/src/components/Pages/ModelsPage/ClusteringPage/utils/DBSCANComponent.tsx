import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

interface DataPoint {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    [key: string]: number;
}

interface DBSCANProps {
    data: DataPoint[];
    epsilon: number;
    minPoints: number;
    onClusteringComplete?: (clusters: number[]) => void;
}

interface DBSCANState {
    clusters: number[];
    processing: boolean;
    error: string | null;
}
const DBSCANClustering: React.FC<DBSCANProps> = ({
    data,
    epsilon,
    minPoints,
    onClusteringComplete
}) => {
    const [state, setState] = useState<DBSCANState>({
        clusters: [],
        processing: false,
        error: null
    });

    const [dbscanParams, setDbscanParams] = useState({
        epsilon: 0.9,
        minPoints: 3
    });

    const getNeighbors = async (
        pointIdx: number,
        tensorData: tf.Tensor2D,
        eps: number
    ): Promise<number[]> => {
        return tf.tidy(() => {
            const point = tensorData.slice([pointIdx, 0], [1, tensorData.shape[1]]) as tf.Tensor2D;
            const expanded = tf.expandDims(point, 0);
            const differences = tensorData.sub(expanded);
            const distances = tf.sqrt(tf.sum(differences.square(), 1));

            const distanceArray = Array.from(distances.dataSync());
            return distanceArray
                .map((dist, idx) => ({ dist, idx }))
                .filter(({ dist }) => dist <= eps)
                .map(({ idx }) => idx);
        });
    };

    const expandCluster = async (
        pointIdx: number,
        neighbors: number[],
        visited: Set<number>,
        tensorData: tf.Tensor2D,
        eps: number,
        minPts: number,
        labels: number[],
        clusterLabel: number
    ): Promise<void> => {
        labels[pointIdx] = clusterLabel;

        for (let i = 0; i < neighbors.length; i++) {
            const neighborIdx = neighbors[i];

            if (!visited.has(neighborIdx)) {
                visited.add(neighborIdx);
                const newNeighbors = await getNeighbors(neighborIdx, tensorData, eps);

                if (newNeighbors.length >= minPts) {
                    neighbors.push(...newNeighbors.filter(n => !neighbors.includes(n)));
                }
            }

            if (labels[neighborIdx] === -1) {
                labels[neighborIdx] = clusterLabel;
            }
        }
    };

    const normalizeData = (tensor: tf.Tensor2D) => {
        return tf.tidy(() => {
            const min = tensor.min(0);
            const max = tensor.max(0);
            const normalizedTensor = tensor.sub(min).div(max.sub(min)) as tf.Tensor2D;
            return { normalizedTensor, min, max };
        });
    };

    const performDBSCAN = async () => {
        setState(prev => ({ ...prev, processing: true, error: null }));

        let tensor: tf.Tensor2D | null = null;
        let normalizedTensor: tf.Tensor2D | null = null;

        try {
            const features = data.map(d => [
                d.timeOnPage,
                d.scrollDepth,
                d.clickCount
            ]);

            tensor = tf.tensor2d(features);
            const normalized = normalizeData(tensor);
            normalizedTensor = normalized.normalizedTensor;

            const visited = new Set<number>();
            const labels = new Array(normalizedTensor.shape[0]).fill(-1);
            let clusterLabel = 0;

            for (let pointIdx = 0; pointIdx < normalizedTensor.shape[0]; pointIdx++) {
                if (visited.has(pointIdx)) continue;

                visited.add(pointIdx);
                const neighbors = await getNeighbors(pointIdx, normalizedTensor, epsilon);

                if (neighbors.length < minPoints) {
                    continue;
                }

                await expandCluster(
                    pointIdx,
                    neighbors,
                    visited,
                    normalizedTensor,
                    epsilon,
                    minPoints,
                    labels,
                    clusterLabel
                );

                clusterLabel++;
            }

            setState(prev => ({
                ...prev,
                clusters: labels,
                processing: false
            }));

            if (onClusteringComplete) {
                onClusteringComplete(labels);
            }

        } catch (error) {
            setState(prev => ({
                ...prev,
                processing: false,
                error: error instanceof Error ? error.message : 'An error occurred'
            }));
        } finally {
            // Очистка тензоров
            if (tensor) tensor.dispose();
            if (normalizedTensor) normalizedTensor.dispose();
        }
    };

    const getClusteringInterpretation = (
        totalPoints: number,
        numClusters: number,
        noisePoints: number
    ): string => {
        const noisePercentage = (noisePoints / totalPoints) * 100;
        const averageClusterSize = Math.round((totalPoints - noisePoints) / numClusters);

        let interpretation = '';

        if (numClusters === 0) {
            interpretation = 'Алгоритм не смог выделить четкие поведенческие паттерны пользователей. Возможно, стоит скорректировать параметры кластеризации.';
        } else {
            interpretation = `Выявлено ${numClusters} различных групп пользователей со схожим поведением. `;

            if (noisePercentage > 30) {
                interpretation += 'Большое количество нетипичных посещений может указывать на разнородность пользовательского поведения или необходимость корректировки параметров анализа.';
            } else if (noisePercentage < 10) {
                interpretation += 'Низкий уровень шума говорит о четко выраженных поведенческих паттернах.';
            }

            interpretation += ` В среднем ${averageClusterSize} пользователей в каждой группе.`;
        }

        return interpretation;
    };

    const suggestParameters = (data: DataPoint[]): { epsilon: number, minPoints: number } => {
        // Примерная эвристика для подбора параметров
        const n = data.length;

        // Рекомендуемое количество минимальных точек зависит от размера датасета
        const suggestedMinPoints = Math.max(3, Math.floor(Math.log(n)));

        // Epsilon можно подобрать как процентиль от распределения расстояний
        const features = data.map(d => [
            d.timeOnPage,
            d.scrollDepth,
            d.clickCount
        ]);

        // Нормализуем данные
        const normalized = features.map(row => {
            const sum = Math.sqrt(row.reduce((acc, val) => acc + val * val, 0));
            return row.map(val => val / sum);
        });

        // Находим среднее расстояние между точками
        let distances: number[] = [];
        for (let i = 0; i < normalized.length; i++) {
            for (let j = i + 1; j < normalized.length; j++) {
                const dist = Math.sqrt(
                    normalized[i].reduce((acc, val, idx) =>
                        acc + Math.pow(val - normalized[j][idx], 2), 0)
                );
                distances.push(dist);
            }
        }

        // Берём 75-й процентиль как epsilon
        distances.sort((a, b) => a - b);
        const suggestedEpsilon = distances[Math.floor(distances.length * 0.75)];

        return {
            epsilon: suggestedEpsilon,
            minPoints: suggestedMinPoints
        };
    };

    const getClusterDetails = (clusters: number[]) => {
        const clusterSizes = new Map<number, number>();
        clusters.forEach(cluster => {
            clusterSizes.set(cluster, (clusterSizes.get(cluster) || 0) + 1);
        });

        return Array.from(clusterSizes.entries())
            .filter(([cluster]) => cluster !== -1)
            .sort((a, b) => b[1] - a[1]);
    };

    const clusterDetails = state.clusters.length > 0 ? getClusterDetails(state.clusters) : [];

    const validateParameters = (epsilon: number, minPoints: number, dataLength: number): string | null => {
        if (epsilon <= 0) {
            return "Радиус близости должен быть больше 0";
        }
        if (epsilon >= 1) {
            return "Радиус близости слишком большой, рекомендуется значение меньше 1";
        }
        if (minPoints < 2) {
            return "Минимальное количество точек должно быть не меньше 2";
        }
        if (minPoints > dataLength / 2) {
            return "Минимальное количество точек слишком большое для размера данных";
        }
        return null;
    };

    useEffect(() => {
        if (data.length > 0) {
            const validationError = validateParameters(epsilon, minPoints, data.length);
            if (validationError) {
                setState(prev => ({
                    ...prev,
                    error: validationError
                }));
                return;
            }
            performDBSCAN();
        }
    }, [data, epsilon, minPoints]);

    // Используйте эту функцию при инициализации
    useEffect(() => {
        if (data.length > 0) {
            const suggested = suggestParameters(data);
            setDbscanParams(suggested);
        }
    }, [data]);

    useEffect(() => {
        if (data.length > 0) {
            performDBSCAN();
        }
    }, [data, epsilon, minPoints]);













    const analyzeData = (data: DataPoint[]) => {
        const stats = {
            timeOnPage: {
                min: Math.min(...data.map(d => d.timeOnPage)),
                max: Math.max(...data.map(d => d.timeOnPage)),
                avg: data.reduce((sum, d) => sum + d.timeOnPage, 0) / data.length
            },
            scrollDepth: {
                min: Math.min(...data.map(d => d.scrollDepth)),
                max: Math.max(...data.map(d => d.scrollDepth)),
                avg: data.reduce((sum, d) => sum + d.scrollDepth, 0) / data.length
            },
            clickCount: {
                min: Math.min(...data.map(d => d.clickCount)),
                max: Math.max(...data.map(d => d.clickCount)),
                avg: data.reduce((sum, d) => sum + d.clickCount, 0) / data.length
            }
        };

        // Вычислим расстояния между точками
        let distances: number[] = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                const dist = Math.sqrt(
                    Math.pow(data[i].timeOnPage - data[j].timeOnPage, 2) +
                    Math.pow(data[i].scrollDepth - data[j].scrollDepth, 2) +
                    Math.pow(data[i].clickCount - data[j].clickCount, 2)
                );
                distances.push(dist);
            }
        }
        distances.sort((a, b) => a - b);

        return {
            stats,
            distances: {
                min: distances[0],
                max: distances[distances.length - 1],
                median: distances[Math.floor(distances.length / 2)],
                p25: distances[Math.floor(distances.length * 0.25)],
                p75: distances[Math.floor(distances.length * 0.75)]
            }
        };
    };


    const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const interpretCluster = (clusterPoints: DataPoint[]) => {
        const avgTime = mean(clusterPoints.map(p => p.timeOnPage));
        const avgScroll = mean(clusterPoints.map(p => p.scrollDepth));
        const avgClicks = mean(clusterPoints.map(p => p.clickCount));

        let behavior = '';

        if (avgTime < 60) { // менее минуты
            behavior += 'Быстрые просмотры. ';
        } else if (avgTime < 300) { // до 5 минут
            behavior += 'Средняя продолжительность визита. ';
        } else {
            behavior += 'Длительные сессии. ';
        }

        if (avgScroll < 30) {
            behavior += 'Поверхностное чтение. ';
        } else if (avgScroll > 70) {
            behavior += 'Глубокое изучение контента. ';
        }

        if (avgClicks < 5) {
            behavior += 'Пассивное поведение.';
        } else if (avgClicks > 20) {
            behavior += 'Активное взаимодействие.';
        }

        return behavior;
    };








    useEffect(() => {
        if (data.length > 0) {
            const analysis = analyzeData(data);
            console.log('Data Analysis:', analysis);

            // Предложим оптимальные параметры
            const suggestedEpsilon = analysis.distances.p75;
            console.log(`Suggested epsilon: ${suggestedEpsilon}`);
            console.log(`Current epsilon: ${epsilon}`);

            // Выведем примеры близких точек
            const closePoints = [];
            for (let i = 0; i < data.length; i++) {
                for (let j = i + 1; j < data.length; j++) {
                    const dist = Math.sqrt(
                        Math.pow(data[i].timeOnPage - data[j].timeOnPage, 2) +
                        Math.pow(data[i].scrollDepth - data[j].scrollDepth, 2) +
                        Math.pow(data[i].clickCount - data[j].clickCount, 2)
                    );
                    if (dist < epsilon) {
                        closePoints.push({ point1: data[i], point2: data[j], distance: dist });
                    }
                }
            }
            console.log('Close points examples:', closePoints.slice(0, 5));
        }
    }, [data, epsilon]);

    return (
        <div className="dbscan-clustering">
            <div className="clustering-info">
                <h3>Анализ поведенческих паттернов</h3>
                <div className="parameters">
                    <div className="parameter">
                        <span title="Максимальное расстояние между точками в одном кластере">
                            Радиус близости (Epsilon):
                        </span>
                        <span>{epsilon}</span>
                    </div>
                    <div className="parameter">
                        <span title="Минимальное количество точек для формирования кластера">
                            Минимальное количество точек:
                        </span>
                        <span>{minPoints}</span>
                    </div>
                </div>
            </div>

            {state.processing && (
                <div className="processing-status">
                    <span>Выполняется анализ данных...</span>
                </div>
            )}

            {state.error && (
                <div className="error-message">
                    <span>Ошибка: {state.error}</span>
                </div>
            )}

            {clusterDetails.length > 0 && (
                <div className="cluster-details">
                    <h5>Детали кластеров:</h5>
                    {clusterDetails.map(([cluster, size], idx) => (
                        <div key={cluster} className="cluster-detail">
                            <span>Группа {idx + 1}:</span>
                            <span>{size} пользователей ({Math.round(size / state.clusters.length * 100)}%)</span>
                        </div>
                    ))}
                </div>
            )}

            {!state.processing && state.clusters.length > 0 && (
                <div className="clustering-results">
                    <h4>Результаты анализа</h4>
                    <div className="cluster-stats">
                        <div className="stat">
                            <span title="Количество выявленных групп пользователей со схожим поведением">
                                Количество поведенческих групп:
                            </span>
                            <span>
                                {new Set(state.clusters.filter(c => c !== -1)).size}
                            </span>
                        </div>
                        <div className="stat">
                            <span title="Количество пользователей с нетипичным поведением">
                                Нетипичные посещения:
                            </span>
                            <span>
                                {state.clusters.filter(c => c === -1).length}
                                {' '}
                                ({Math.round((state.clusters.filter(c => c === -1).length / state.clusters.length) * 100)}%)
                            </span>
                        </div>
                    </div>

                    <div className="interpretation">
                        <h5>Интерпретация результатов:</h5>
                        <p>
                            {getClusteringInterpretation(
                                state.clusters.length,
                                new Set(state.clusters.filter(c => c !== -1)).size,
                                state.clusters.filter(c => c === -1).length
                            )}
                        </p>
                    </div>

                    <div className="recommendations">
                        <h5>Рекомендации:</h5>
                        <ul>
                            {state.clusters.filter(c => c === -1).length > state.clusters.length * 0.3 && (
                                <li>Большое количество нетипичных посещений. Рекомендуется увеличить радиус близости (Epsilon) или уменьшить минимальное количество точек.</li>
                            )}
                            {new Set(state.clusters.filter(c => c !== -1)).size === 1 && (
                                <li>Выявлена только одна группа пользователей. Попробуйте уменьшить радиус близости для более детального разделения.</li>
                            )}
                            {new Set(state.clusters.filter(c => c !== -1)).size > 10 && (
                                <li>Выявлено много мелких групп. Возможно, стоит увеличить радиус близости для получения более обобщенных паттернов.</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}









            {data.length > 0 && (
                <div className="data-analysis">
                    <h5>Анализ данных:</h5>
                    <div className="stats">
                        <div>
                            <strong>Время на странице:</strong>
                            <ul>
                                <li>Мин: {Math.round(analyzeData(data).stats.timeOnPage.min)}с</li>
                                <li>Макс: {Math.round(analyzeData(data).stats.timeOnPage.max)}с</li>
                                <li>Среднее: {Math.round(analyzeData(data).stats.timeOnPage.avg)}с</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Глубина прокрутки:</strong>
                            <ul>
                                <li>Мин: {Math.round(analyzeData(data).stats.scrollDepth.min)}%</li>
                                <li>Макс: {Math.round(analyzeData(data).stats.scrollDepth.max)}%</li>
                                <li>Среднее: {Math.round(analyzeData(data).stats.scrollDepth.avg)}%</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Количество кликов:</strong>
                            <ul>
                                <li>Мин: {analyzeData(data).stats.clickCount.min}</li>
                                <li>Макс: {analyzeData(data).stats.clickCount.max}</li>
                                <li>Среднее: {Math.round(analyzeData(data).stats.clickCount.avg)}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}



            {clusterDetails.length > 0 && (
                <div className="cluster-details">
                    <h5>Поведенческие паттерны:</h5>
                    {clusterDetails.map(([cluster, size], idx) => {
                        const clusterPoints = data.filter((_, i) => state.clusters[i] === cluster);
                        return (
                            <div key={cluster} className="cluster-detail">
                                <h6>Группа {idx + 1} ({size} пользователей):</h6>
                                <p>{interpretCluster(clusterPoints)}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DBSCANClustering;