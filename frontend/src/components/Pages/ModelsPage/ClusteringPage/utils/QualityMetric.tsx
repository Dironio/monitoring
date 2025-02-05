import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';

interface ClusteringMetricsProps {
    data: tf.Tensor2D;
    labels: number[];
    centroids: number[][];
}

interface MetricsState {
    silhouetteScore: number;
    daviesBouldinIndex: number;
}

const ClusteringMetrics: React.FC<ClusteringMetricsProps> = ({
    data,
    labels,
    centroids
}) => {
    const [metrics, setMetrics] = useState<MetricsState | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const calculateIntraClusterDistance = async (
        point: tf.Tensor2D,
        clusterData: tf.Tensor2D,
        clusterLabels: number[],
        label: number
    ): Promise<number> => {
        const indices = await tf.whereAsync(tf.tensor1d(clusterLabels).equal(tf.scalar(label)));
        const clusterPoints = tf.gather(clusterData, indices.squeeze());

        if (clusterPoints.shape[0] === 0) return 0;

        const distances = tf.tidy(() => {
            const expanded = tf.expandDims(point, 0);
            const differences = clusterPoints.sub(expanded);
            return tf.sqrt(tf.sum(differences.square(), 1));
        });

        const meanDistance = await distances.mean().data();
        return meanDistance[0];
    };

    const calculateMinInterClusterDistance = async (
        point: tf.Tensor2D,
        clusterData: tf.Tensor2D,
        clusterLabels: number[],
        label: number
    ): Promise<number> => {
        const uniqueLabels = Array.from(new Set(clusterLabels));
        let minDistance = Infinity;

        for (const otherLabel of uniqueLabels) {
            if (otherLabel === label) continue;

            const indices = await tf.whereAsync(
                tf.tensor1d(clusterLabels).equal(tf.scalar(otherLabel))
            );
            const otherClusterPoints = tf.gather(clusterData, indices.squeeze());

            if (otherClusterPoints.shape[0] === 0) continue;

            const distances = tf.tidy(() => {
                const expanded = tf.expandDims(point, 0);
                const differences = otherClusterPoints.sub(expanded);
                return tf.sqrt(tf.sum(differences.square(), 1));
            });

            const meanDistance = await distances.mean().data();
            minDistance = Math.min(minDistance, meanDistance[0]);
        }

        return minDistance;
    };

    const calculateSilhouetteScore = async (
        tensorData: tf.Tensor2D,
        clusterLabels: number[]
    ): Promise<number> => {
        const n = tensorData.shape[0];
        let silhouetteSum = 0;

        for (let i = 0; i < n; i++) {
            const point = tensorData.slice([i, 0], [1, tensorData.shape[1]]);
            const label = clusterLabels[i];

            const intraClusterDist = await calculateIntraClusterDistance(
                point, tensorData, clusterLabels, label
            );
            const interClusterDist = await calculateMinInterClusterDistance(
                point, tensorData, clusterLabels, label
            );

            const silhouetteCoef = (interClusterDist - intraClusterDist) /
                Math.max(intraClusterDist, interClusterDist);

            silhouetteSum += silhouetteCoef;
        }

        return silhouetteSum / n;
    };

    const calculateDaviesBouldinIndex = async (
        tensorData: tf.Tensor2D,
        clusterLabels: number[],
        clusterCentroids: tf.Tensor2D
    ): Promise<number> => {
        const uniqueLabels = Array.from(new Set(clusterLabels));
        let dbSum = 0;

        for (let i = 0; i < uniqueLabels.length; i++) {
            for (let j = i + 1; j < uniqueLabels.length; j++) {
                const centroidI = clusterCentroids.slice([i, 0], [1, -1]);
                const centroidJ = clusterCentroids.slice([j, 0], [1, -1]);

                const scatterI = await calculateIntraClusterDistance(
                    centroidI, tensorData, clusterLabels, i
                );
                const scatterJ = await calculateIntraClusterDistance(
                    centroidJ, tensorData, clusterLabels, j
                );

                const centroidDist = tf.norm(centroidI.sub(centroidJ)).dataSync()[0];

                if (centroidDist === 0) continue;

                const ratio = (scatterI + scatterJ) / centroidDist;
                dbSum += ratio;
            }
        }

        return dbSum / (uniqueLabels.length * (uniqueLabels.length - 1) / 2);
    };

    const calculateMetrics = async () => {
        setIsCalculating(true);
        try {
            const silhouetteScore = await calculateSilhouetteScore(data, labels);
            const dbIndex = await calculateDaviesBouldinIndex(
                data,
                labels,
                tf.tensor2d(centroids)
            );

            setMetrics({
                silhouetteScore,
                daviesBouldinIndex: dbIndex
            });
        } catch (error) {
            console.error('Error calculating metrics:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    useEffect(() => {
        if (data && labels.length > 0 && centroids.length > 0) {
            calculateMetrics();
        }
    }, [data, labels, centroids]);

    if (isCalculating) {
        return (
            <div className="clustering-metrics">
                <div className="loading-container">
                    <h3>Расчёт метрик качества...</h3>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="clustering-metrics">
            <h3>Метрики качества кластеризации</h3>
            <div className="metrics-container">
                <div className="metric-item">
                    <h4>Силуэтный коэффициент</h4>
                    <p>{metrics.silhouetteScore.toFixed(3)}</p>
                    <small>
                        От -1 до 1. Чем ближе к 1, тем лучше разделение кластеров
                    </small>
                </div>
                <div className="metric-item">
                    <h4>Индекс Дэвиса-Болдина</h4>
                    <p>{metrics.daviesBouldinIndex.toFixed(3)}</p>
                    <small>
                        Чем меньше значение, тем лучше разделение кластеров
                    </small>
                </div>
            </div>
        </div>
    );
};


export default ClusteringMetrics;