import React, { useEffect, useMemo, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
    Cell
} from 'recharts';
import { getAPI } from '../../../utils/axiosGet';
import { useSiteContext } from '../../../utils/SiteContext';
import './ClusteringPage.css';
import ClusteringMetrics from './utils/QualityMetric';
import DBSCANClustering from './utils/DBSCANComponent';

interface DataPoint {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    [key: string]: number;
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
    normalizedData?: tf.Tensor2D;
}

interface UserMetric {
    sessionId: string;
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
}

interface UserAnalysis {
    data: UserMetric[];
    status: number;
    statusText: string;
}

interface NormalizedResult {
    normalizedTensor: tf.Tensor2D;
    min: tf.Tensor1D;
    max: tf.Tensor1D;
}


const ClusteringPage: React.FC = () => {
    // const [data, setData] = useState<DataPoint[]>([]);
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
    const [activePoint, setActivePoint] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [data, setData] = useState<DataPoint[]>([]);
    const [dbscanParams, setDbscanParams] = useState({
        epsilon: 0.5,
        minPoints: 3
    });

    const fetchClusterData = async () => {
        if (!selectedSite) {
            setError('Сайт не выбран');
            setLoading(false);
            return;
        }
        try {
            console.log('Fetching cluster data for web_id:', selectedSite.value);

            const clusterData = await getAPI.get<UserAnalysis>(`/events/clustering/user-analysis?web_id=${selectedSite.value}`)

            console.log('Received response:', clusterData);

            if (!Array.isArray(clusterData.data)) {
                throw new Error('Expected array of data');
            }

            console.log('First data item:', clusterData.data[0]);

            const invalidItems = clusterData.data.filter(item =>
                typeof item.sessionId !== 'string' ||
                typeof item.timeOnPage !== 'number' ||
                typeof item.scrollDepth !== 'number' ||
                typeof item.clickCount !== 'number'
            );

            if (invalidItems.length > 0) {
                console.error('Invalid items found:', invalidItems);
                throw new Error(`Found ${invalidItems.length} items with invalid format`);
            }

            setData(clusterData.data);

            const processedData = clusterData.data.map(item => ({
                ...item,
                timeOnPage: Number(item.timeOnPage),
                scrollDepth: Number(item.scrollDepth),
                clickCount: Number(item.clickCount)
            }));

            setData(processedData);

        } catch (error) {
            console.error('Detailed error:', error);
            if (error instanceof Error) {
                throw new Error(`Data processing error: ${error.message}`);
            }
            throw new Error('Invalid data format received from server');
        }
    };

    const average = (arr: number[]): number =>
        arr.reduce((acc, val) => acc + val, 0) / arr.length;

    useEffect(() => {
        if (selectedSite?.value) {
            fetchClusterData();
        }
    }, [selectedSite]);

    const normalizeData = (tensor: tf.Tensor2D): NormalizedResult => {
        return tf.tidy(() => {
            // Явно приводим результаты к Tensor1D
            const min = tensor.min(0) as tf.Tensor1D;
            const max = tensor.max(0) as tf.Tensor1D;

            // Нормализуем данные
            const normalizedTensor = tensor.sub(min).div(max.sub(min)) as tf.Tensor2D;

            return {
                normalizedTensor,
                min,
                max
            };
        });
    };

    const normalizeViewData = (data: any[]) => {
        const maxTime = Math.max(...data.map(d => d.timeOnPage));
        const maxScroll = Math.max(...data.map(d => d.scrollDepth));
        const maxClicks = Math.max(...data.map(d => d.clickCount));

        return data.map(item => ({
            ...item,
            timeOnPage: maxTime ? (item.timeOnPage / maxTime) * 100 : 0,
            scrollDepth: maxScroll ? (item.scrollDepth / maxScroll) * 100 : 0,
            clickCount: maxClicks ? (item.clickCount / maxClicks) * 100 : 0
        }));
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
            const normalizedResult = normalizeData(tensor);
            const { normalizedTensor } = normalizedResult;

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
                iteration,
                normalizedData: normalizedTensor
            });

        } finally {
            setIsProcessing(false);
        }
    };


    const mean = (numbers: number[]): number => {
        if (numbers.length === 0) return 0;
        return numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    };

    const [viewMode, setViewMode] = useState({
        x: 'timeOnPage',
        y: 'scrollDepth'
    });

    const formatTime = (seconds: number): string => {
        if (seconds < 60) return `${Math.round(seconds)}с`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}м ${remainingSeconds}с`;
    };

    const formatScroll = (scrollValue: number): number => {
        const documentHeight = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const viewportHeight = window.innerHeight;
        const maxScroll = documentHeight - viewportHeight;

        const scrollPercent = (scrollValue / maxScroll) * 100;
        return Math.min(Math.round(scrollPercent), 100);
    };




    const calculateDistances = (points: tf.Tensor2D, centroids: tf.Tensor2D) => {
        return tf.tidy(() => {
            const expanded = tf.expandDims(points, 1);
            const centroidsExpanded = tf.expandDims(centroids, 0);
            return tf.sum(tf.square(tf.sub(expanded, centroidsExpanded)), 2);
        });
    };

    const getAxisName = (key: string): string => {
        const names = {
            timeOnPage: 'Время на странице',
            scrollDepth: 'Глубина скролла',
            clickCount: 'Количество кликов'
        };
        return names[key as keyof typeof names] || '';
    };

    const getAxisLabel = (key: string): string => {
        const labels = {
            timeOnPage: 'Время на странице (сек)',
            scrollDepth: 'Глубина скролла (%)',
            clickCount: 'Количество кликов'
        };
        return labels[key as keyof typeof labels] || '';
    };

    const normalizedViewData = useMemo(() => normalizeViewData(data), [data]);

    const handleDBSCANComplete = (clusters: number[]) => {
        console.log('DBSCAN clustering completed', clusters);
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


            <div className="view-controls">
                <select
                    value={viewMode.x}
                    onChange={e => setViewMode({ ...viewMode, x: e.target.value })}
                >
                    <option value="timeOnPage">Время на странице</option>
                    <option value="scrollDepth">Глубина скролла</option>
                    <option value="clickCount">Количество кликов</option>
                </select>
                <select
                    value={viewMode.y}
                    onChange={e => setViewMode({ ...viewMode, y: e.target.value })}
                >
                    <option value="scrollDepth">Глубина скролла</option>
                    <option value="timeOnPage">Время на странице</option>
                    <option value="clickCount">Количество кликов</option>
                </select>
            </div>


            {state && (
                <div className="results">
                    <div className="visualization">
                        <ScatterChart
                            width={800}
                            height={600}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 60,
                                left: 60,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                dataKey={viewMode.x}
                                name={getAxisName(viewMode.x)}
                                label={{
                                    value: getAxisLabel(viewMode.x),
                                    position: 'bottom',
                                    offset: 20
                                }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                type="number"
                                dataKey={viewMode.y}
                                name={getAxisName(viewMode.y)}
                                label={{
                                    value: getAxisLabel(viewMode.y),
                                    angle: -90,
                                    position: 'left',
                                    offset: 40
                                }}
                                tick={{ fontSize: 12 }}
                                domain={[0, 'dataMax + 10']}
                            />
                            <Tooltip
                                content={({ payload }) => {
                                    if (payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="custom-tooltip" style={{
                                                backgroundColor: 'white',
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                borderRadius: '4px'
                                            }}>
                                                <p><strong>Сессия:</strong> {data.sessionId}</p>
                                                <p><strong>Время:</strong> {formatTime(data.timeOnPage)}</p>
                                                <p><strong>Скролл:</strong> {Math.round(data.scrollDepth)}%</p>
                                                <p><strong>Клики:</strong> {data.clickCount}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                wrapperStyle={{ pointerEvents: 'none' }}
                            />
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{
                                    paddingLeft: '20px',
                                    maxHeight: '400px',
                                    overflowY: 'auto'
                                }}
                            />
                            {Array.from(new Set(state.clusters)).map((clusterIndex, idx) => {
                                const clusterData = data.filter((_, i) =>
                                    state.clusters[i] === clusterIndex
                                );

                                return (
                                    <Scatter
                                        key={idx}
                                        name={`Кластер ${idx + 1} (${clusterData.length})`}
                                        data={clusterData}
                                        fill={`hsla(${(360 / config.k) * idx}, 70%, 50%, 0.6)`}
                                    >
                                        {clusterData.map((point, pointIdx) => (
                                            <Cell
                                                key={pointIdx}
                                                onMouseEnter={(e: React.MouseEvent) => {
                                                    setActivePoint(point.sessionId);
                                                    setTooltipPos({
                                                        x: e.clientX,
                                                        y: e.clientY
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    setActivePoint(null);
                                                }}
                                            />
                                        ))}
                                    </Scatter>
                                );
                            })}
                        </ScatterChart>
                    </div>

                    <div className="cluster-analysis">
                        <h3>Анализ кластеров</h3>
                        <div className="cluster-stats">
                            {Array.from(new Set(state.clusters)).map((clusterIndex, idx) => {
                                const clusterData = data.filter((_, i) =>
                                    state.clusters[i] === clusterIndex
                                );
                                const avgTime = mean(clusterData.map(d => d.timeOnPage));
                                const avgScroll = mean(clusterData.map(d => d.scrollDepth));
                                const avgClicks = mean(clusterData.map(d => d.clickCount));

                                return (
                                    <div key={idx} className="cluster-stat-item">
                                        <h4>Кластер {idx + 1}</h4>
                                        <p>Количество сессий: {clusterData.length}</p>
                                        <p>Среднее время: {Math.round(avgTime)}с</p>
                                        <p>Средний скролл: {Math.round(avgScroll)}%</p>
                                        <p>Среднее кол-во кликов: {Math.round(avgClicks)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {state && state.normalizedData && (
                        <ClusteringMetrics
                            data={state.normalizedData}
                            labels={state.clusters}
                            centroids={state.centroids}
                        />
                    )}



                    {data.length > 0 && (
                        <DBSCANClustering
                            data={data}
                            epsilon={dbscanParams.epsilon}
                            minPoints={dbscanParams.minPoints}
                            onClusteringComplete={handleDBSCANComplete}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default ClusteringPage;