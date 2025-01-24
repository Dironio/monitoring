// import React, { useState, useEffect, useMemo } from 'react';
// import {
//     ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
//     Tooltip, ResponsiveContainer, Legend,
//     BarChart, Bar, LineChart, Line
// } from 'recharts';
// import './ClusteringPage.css';
// import { useSiteContext } from '../../../utils/SiteContext';
// import { ClusterData, TemporalData } from '../../../../models/cluster.model';
// import { getAPI } from '../../../utils/axiosGet';
// import { TimeUnitOption, TimeUnitSelector } from '../Component/TimeUnitSelector';
// import AnalysisRecommendations from '../Component/AnalysisRecomendationComponent';
// import moment from 'moment';

// const ClusteringComponent: React.FC = () => {
//     const [clusterData, setClusterData] = useState<ClusterData | null>(null);
//     const [temporalData, setTemporalData] = useState<TemporalData[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const { selectedSite } = useSiteContext();
//     const [timeUnit, setTimeUnit] = useState<TimeUnitOption>({
//         value: 'hour',
//         label: 'По часам'
//     });

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!selectedSite) {
//                 setError('Сайт не выбран');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 const [clusterResponse, temporalResponse] = await Promise.all([
//                     getAPI.get<ClusterData>(`/events/clustering/interaction-clusters?web_id=${selectedSite.value}&cluster_count=${5}`),
//                     getAPI.get<TemporalData[]>(`/events/clustering/temporal-analysis?web_id=${selectedSite.value}&time_unit=${timeUnit.value}`)
//                 ]);

//                 console.log('Raw response from backend:', temporalResponse.data[0]);
//                 console.log('temporal: ', temporalResponse.data);
//                 console.log('cluster: ', clusterResponse.data);
//                 setClusterData(clusterResponse.data);
//                 setTemporalData(temporalResponse.data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [selectedSite]);

//     const formatTemporalData = (data: TemporalData[]) => {
//         return data.map(item => {
//             console.log('Processing item:', item);
//             const date = moment(item.time_bucket, [
//                 moment.ISO_8601,
//                 'YYYY-MM-DD HH:mm:ss',
//                 'YYYY-MM-DD"T"HH:mm:ss.SSSZ'
//             ]);

//             console.log('Parsed date:', date);

//             return {
//                 original_time: item.time_bucket, // для отладки
//                 time_bucket: date.isValid()
//                     ? date.format(getTimeFormat(timeUnit.value))
//                     : `${item.time_bucket}`,
//                 event_count: Number(item.event_count),
//                 unique_users: Number(item.unique_users)
//             };
//         });
//     };

//     const getTimeFormat = (timeUnit: string) => {
//         switch (timeUnit) {
//             case 'hour':
//                 return 'HH:00';
//             case 'day':
//                 return 'DD.MM';
//             case 'month':
//                 return 'MM.YYYY';
//             case 'week':
//                 return 'DD.MM';
//             default:
//                 return 'HH:00';
//         }
//     };

//     const formattedData = useMemo(() => {
//         return formatTemporalData(temporalData);
//     }, [temporalData, timeUnit]);

//     useEffect(() => {
//         console.log('Full temporal data:', temporalData);
//         console.log('Time unit:', timeUnit);
//     }, [temporalData, timeUnit]);

//     if (loading) {
//         return <div className="loading-state">Загрузка данных...</div>;
//     }

//     if (error) {
//         return <div className="error-state">Ошибка: {error}</div>;
//     }

//     if (!clusterData || !temporalData.length) {
//         return <div className="error-state">Нет данных для анализа</div>;
//     }

//     return (
//         <div className="dashboard">
//             <header className="dashboard__header">
//                 <h1 className="dashboard__title">Анализ поведения пользователей</h1>
//                 <p className="dashboard__subtitle">
//                     Кластерный анализ и временные паттерны взаимодействия
//                 </p>
//             </header>

//             {/* Добавляем селектор времени после header */}
//             <div className="controls-section">
//                 <TimeUnitSelector
//                     value={timeUnit}
//                     onChange={(option) => option && setTimeUnit(option)}
//                 />
//             </div>

//             <section className="methodology">
//                 <div className="methodology__grid">
//                     <div className="methodology__section">
//                         <h3 className="methodology__title">DBSCAN Кластеризация</h3>
//                         <div className="methodology__formula">
//                             <p>eps-окрестность: N<sub>eps</sub>(p) = {'{q ∈ D | dist(p,q) ≤ eps}'}</p>
//                             <p>Плотность: |N<sub>eps</sub>(p)| ≥ minPts</p>
//                         </div>
//                     </div>
//                     <div className="methodology__section">
//                         <h3 className="methodology__title">Метрики качества</h3>
//                         <div className="methodology__formula">
//                             <p>Silhouette Score = (b - a) / max(a, b)</p>
//                             <p>Davies-Bouldin Index = 1/n Σ max((σi + σj)/d(ci,cj))</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <div className="charts-grid">
//                 <div className="chart-container">
//                     <div className="chart-header">
//                         <h2 className="chart-title">Распределение взаимодействий</h2>
//                     </div>
//                     <div className="chart-content">
//                         <div className="chart-wrapper">
//                             <ResponsiveContainer width="100%" height={400}>
//                                 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis
//                                         dataKey="x_coord"
//                                         name="X координата"
//                                         label={{ value: 'X координата', position: 'bottom' }}
//                                     />
//                                     <YAxis
//                                         dataKey="y_coord"
//                                         name="Y координата"
//                                         label={{ value: 'Y координата', angle: -90, position: 'left' }}
//                                     />
//                                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                                     <Legend />
//                                     {clusterData?.clusters.map((cluster, idx) => (
//                                         <Scatter
//                                             key={idx}
//                                             name={`Кластер ${idx + 1}`}
//                                             data={cluster}
//                                             fill={`hsl(${(idx * 137) % 360}, 70%, 50%)`}
//                                         />
//                                     ))}
//                                 </ScatterChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="chart-description">
//                             График показывает распределение точек взаимодействия пользователей.
//                             Каждый кластер представляет группу похожих паттернов поведения.
//                         </div>
//                     </div>
//                 </div>

//                 <div className="chart-container">
//                     <div className="chart-header">
//                         <h2 className="chart-title">Временная активность</h2>
//                     </div>
//                     <div className="chart-content">
//                         <div className="chart-wrapper">
//                             <ResponsiveContainer width="100%" height={400}>
//                                 <LineChart data={formattedData}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis
//                                         dataKey="time_bucket"
//                                         label={{ value: 'Время', position: 'bottom' }}
//                                     />
//                                     <YAxis
//                                         label={{
//                                             value: 'Количество событий',
//                                             angle: -90,
//                                             position: 'left'
//                                         }}
//                                     />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Line
//                                         type="monotone"
//                                         dataKey="event_count"
//                                         name="Количество событий"
//                                         stroke="hsl(200, 70%, 50%)"
//                                     />
//                                     <Line
//                                         type="monotone"
//                                         dataKey="unique_users"
//                                         name="Уникальные пользователи"
//                                         stroke="hsl(270, 70%, 50%)"
//                                     />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="chart-description">
//                             График отображает временную динамику активности пользователей,
//                             показывая как общее количество событий, так и число уникальных пользователей.
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <section className="metrics">
//                 <div className="metrics-grid">
//                     {clusterData?.metrics && (
//                         <>
//                             <div className="metric-card">
//                                 <h4 className="metric-title">Silhouette Score</h4>
//                                 <p className="metric-value">{clusterData.metrics.silhouetteScore.toFixed(3)}</p>
//                                 <p className="metric-description">
//                                     Показывает качество разделения кластеров (-1 до 1)
//                                 </p>
//                             </div>
//                             <div className="metric-card">
//                                 <h4 className="metric-title">Davies-Bouldin Index</h4>
//                                 <p className="metric-value">{clusterData.metrics.daviesBouldinIndex.toFixed(3)}</p>
//                                 <p className="metric-description">
//                                     Оценка внутрикластерного расстояния (ниже = лучше)
//                                 </p>
//                             </div>
//                             <div className="metric-card">
//                                 <h4 className="metric-title">Размеры кластеров</h4>
//                                 <div className="metric-value">
//                                     {clusterData.metrics.clusterSizes.map((size, idx) => (
//                                         <span key={idx} className="metric-size">{size}</span>
//                                     ))}
//                                 </div>
//                                 <p className="metric-description">
//                                     Количество точек в каждом кластере
//                                 </p>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </section>

//             <AnalysisRecommendations
//                 clusterData={clusterData}
//                 temporalData={temporalData}
//             />
//         </div>
//     );
// };


// export default ClusteringComponent;





































import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { getAPI } from '../../../utils/axiosGet';
import { useSiteContext } from '../../../utils/SiteContext';

interface DataPoint {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    sessionId: string;
}

interface KMeansConfig {
    k: number;
    maxIterations: number;
    learningRate: number;
}

interface KMeansState {
    clusters: number[];
    centroids: number[][];
    error: number;
    iteration: number;
}

const ClusteringPage: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [config, setConfig] = useState<KMeansConfig>({
        k: 3,
        maxIterations: 100,
        learningRate: 0.01
    });
    const [state, setState] = useState<KMeansState | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedSite } = useSiteContext();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (!selectedSite) {
            setError('Сайт не выбран');
            setLoading(false);
            return;
        }

        try {
            const [clusterResponse] = await Promise.all([
                getAPI.get(`/clustering/user-analysis?web_id=${selectedSite.value}`)
            ])

            // const response = await 
            //             const rawData = await response.json();
            // setData(rawData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const performKMeans = async () => {
        setIsProcessing(true);
        try {
            const features = data.map(d => [
                d.timeOnPage,
                d.scrollDepth,
                d.clickCount
            ]);

            const tensor = tf.tensor2d(features);

            const { normalizedTensor, min, max } = normalizeData(tensor);

            let centroids = tf.randomUniform([config.k, features[0].length]) as tf.Tensor2D;
            let prevCentroids: tf.Tensor2D;
            let iteration = 0;

            const updateCentroids = async (data: tf.Tensor2D, labels: tf.Tensor1D, currentCentroids: tf.Tensor2D): Promise<tf.Tensor2D> => {
                const numClusters = currentCentroids.shape[0];
                const newCentroids = tf.buffer([numClusters, currentCentroids.shape[1]]);

                for (let i = 0; i < numClusters; i++) {
                    const mask = labels.equal(tf.scalar(i));
                    const clusterIndices = await tf.whereAsync(mask);

                    if (clusterIndices.shape[0] > 0) {
                        const flatIndices = tf.reshape(clusterIndices, [-1]) as tf.Tensor1D;

                        const clusterPoints = tf.gather(data, flatIndices);
                        const meanPoint = clusterPoints.mean(0);

                        const meanValues = meanPoint.dataSync();
                        for (let j = 0; j < meanValues.length; j++) {
                            newCentroids.set(meanValues[j], i, j);
                        }

                        flatIndices.dispose();
                        clusterPoints.dispose();
                        meanPoint.dispose();
                    } else {
                        const oldCentroid = currentCentroids.slice([i, 0], [1, -1]);
                        const oldValues = oldCentroid.dataSync();
                        for (let j = 0; j < oldValues.length; j++) {
                            newCentroids.set(oldValues[j], i, j);
                        }
                        oldCentroid.dispose();
                    }

                    clusterIndices.dispose();
                }

                const newCentroidsTensor = newCentroids.toTensor() as tf.Tensor2D;
                return newCentroidsTensor;
            };

            const calculateError = (data: tf.Tensor2D, centroids: tf.Tensor2D, assignments: tf.Tensor1D): number => {
                const distances = calculateDistances(data, centroids);
                const minDistances = distances.min(1);
                return minDistances.mean().dataSync()[0];
            };

            while (iteration < config.maxIterations) {
                prevCentroids = centroids.clone();

                const distances = calculateDistances(normalizedTensor as tf.Tensor2D, centroids);

                const clusterAssignments = distances.argMin(1) as tf.Tensor1D;

                const newCentroids = await updateCentroids(normalizedTensor as tf.Tensor2D, clusterAssignments, centroids);
                centroids.dispose();
                centroids = newCentroids;

                //сходимость
                const centroidChange = tf.sum(tf.sqrt(tf.square(tf.sub(centroids, prevCentroids)))).dataSync()[0];

                if (centroidChange < config.learningRate) {
                    break;
                }

                iteration++;
                prevCentroids.dispose();
            }

            const finalDistances = calculateDistances(normalizedTensor as tf.Tensor2D, centroids);
            const finalAssignments = finalDistances.argMin(1) as tf.Tensor1D;

            setState({
                clusters: Array.from(finalAssignments.dataSync()),
                centroids: centroids.arraySync() as number[][],
                error: calculateError(normalizedTensor as tf.Tensor2D, centroids, finalAssignments),
                iteration
            });

        } finally {
            setIsProcessing(false);
        }
    };

    const normalizeData = (tensor: tf.Tensor2D) => {
        const min = tensor.min(0);
        const max = tensor.max(0);
        const normalizedTensor = tensor.sub(min).div(max.sub(min));
        return { normalizedTensor, min, max };
    };

    const calculateDistances = (points: tf.Tensor2D, centroids: tf.Tensor2D) => {
        return tf.tidy(() => {
            const expanded = tf.expandDims(points, 1);
            const centroidsExpanded = tf.expandDims(centroids, 0);
            return tf.sum(tf.square(tf.sub(expanded, centroidsExpanded)), 2);
        });
    };

    return (
        <div className="kmeans-analysis">
            <div className="controls">
                <div className="config-section">
                    <h3>Параметры кластеризации</h3>
                    <div className="config-inputs">
                        <label>
                            Количество кластеров (K):
                            <input
                                type="number"
                                value={config.k}
                                onChange={e => setConfig({
                                    ...config,
                                    k: parseInt(e.target.value)
                                })}
                                min={2}
                                max={10}
                            />
                        </label>
                        <label>
                            Максимум итераций:
                            <input
                                type="number"
                                value={config.maxIterations}
                                onChange={e => setConfig({
                                    ...config,
                                    maxIterations: parseInt(e.target.value)
                                })}
                                min={10}
                                max={1000}
                            />
                        </label>
                    </div>
                    <button
                        onClick={performKMeans}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Обработка...' : 'Запустить анализ'}
                    </button>
                </div>
            </div>

            {state && (
                <div className="results">
                    <div className="visualization">
                        <ScatterChart
                            width={600}
                            height={400}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid />
                            <XAxis
                                type="number"
                                dataKey="timeOnPage"
                                name="Время на странице"
                            />
                            <YAxis
                                type="number"
                                dataKey="scrollDepth"
                                name="Глубина скролла"
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            {state.clusters.map((cluster, idx) => (
                                <Scatter
                                    key={idx}
                                    name={`Кластер ${idx + 1}`}
                                    data={data.filter((_, i) => state.clusters[i] === idx)}
                                    fill={`hsl(${(360 / config.k) * idx}, 70%, 50%)`}
                                />
                            ))}
                        </ScatterChart>
                    </div>

                    <div className="metrics">
                        <h3>Метрики кластеризации</h3>
                        <p>Количество итераций: {state.iteration}</p>
                        <p>Ошибка кластеризации: {state.error.toFixed(4)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClusteringPage;