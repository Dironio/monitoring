// import clusteringDal from '../data/clustering.dal';
// import { ClusterAnalysis, ClusterResult, SessionPattern, TemporalMetrics, TemporalResult } from './@types/clustering.dto'
// import clusteringUtility from './untils/clustering.utility';


// class ClusteringService {
//     // async getInteractionClusters(webId: number, clusterCount: number): Promise<ClusterAnalysis> {
//     //     const interactionData = await clusteringDal.getInteractionClusters(webId);

//     //     const emptyAnalysis: ClusterAnalysis = {
//     //         clusters: [],
//     //         metrics: {
//     //             silhouetteScore: 0,
//     //             daviesBouldinIndex: 0,
//     //             clusterSizes: [],
//     //             clusterDensity: []
//     //         },
//     //         outliers: []
//     //     };

//     //     if (!interactionData || interactionData.length === 0) {
//     //         return emptyAnalysis;
//     //     }

//     //     const processedClusters = this.processInteractionData(interactionData);

//     //     if (processedClusters.clusters.length === 0) {
//     //         return emptyAnalysis;
//     //     }

//     //     const vectors = await clusteringUtility.prepareVectorsForClustering(
//     //         processedClusters.clusters.flat()
//     //     );

//     //     if (vectors.length === 0) {
//     //         return emptyAnalysis;
//     //     }

//     //     const vectorCoordinates = vectors.map(v => v.coordinates);

//     //     const clusterAnalysis = await clusteringUtility.performDBSCANClustering(
//     //         vectors,
//     //         clusterCount
//     //     );

//     //     const formattedClusters = clusterAnalysis.clusters.map(cluster => ({
//     //         sessions: cluster.sessions.map(session => ({
//     //             sessionId: session.sessionId,
//     //             metrics: {
//     //                 avgDuration: session.metrics.avgDuration,
//     //                 interactionCount: session.metrics.interactionCount,
//     //                 uniqueElements: session.metrics.uniqueElements,
//     //                 complexity: session.metrics.complexity
//     //             }
//     //         })),
//     //         centroid: cluster.centroid
//     //     }));

//     //     const metrics = {
//     //         silhouetteScore: this.safeCalculateSilhouetteScore(vectorCoordinates, clusterAnalysis.clusters),
//     //         daviesBouldinIndex: this.safeCalculateDaviesBouldinIndex(vectorCoordinates, clusterAnalysis.clusters),
//     //         clusterSizes: this.calculateClusterSizes(clusterAnalysis.clusters),
//     //         clusterDensity: clusterAnalysis.metrics.clusterDensity || []
//     //     };

//     //     return {
//     //         clusters: formattedClusters,
//     //         metrics,
//     //         outliers: clusterAnalysis.outliers || []
//     //     };
//     // }

//     async getInteractionClusters(webId: number, clusterCount: number): Promise<ClusterAnalysis> {
//         const interactionData = await clusteringDal.getInteractionClusters(webId);

//         if (!interactionData || interactionData.length === 0) {
//             return getEmptyAnalysis();
//         }

//         const clusters = transformToClusters(interactionData);
//         const vectors = extractVectors(clusters);

//         const metrics = {
//             silhouetteScore: clusteringUtility.calculateSilhouetteScore(vectors, clusters),
//             daviesBouldinIndex: clusteringUtility.calculateDaviesBouldinIndex(vectors, clusters),
//             clusterSizes: clusters.map(c => c.sessions.length),
//             clusterDensity: clusters.map(c => calculateClusterDensity(c))
//         };

//         return {
//             clusters,
//             metrics,
//             outliers: []
//         };
//     }

//     private getEmptyAnalysis(): ClusterAnalysis {
//         return {
//             clusters: [],
//             metrics: {
//                 silhouetteScore: 0,
//                 daviesBouldinIndex: 0,
//                 clusterSizes: [],
//                 clusterDensity: []
//             },
//             outliers: []
//         };
//     }

//     private safeCalculateSilhouetteScore(vectors: number[][], clusters: any[]): number {
//         try {
//             if (!vectors || !clusters || vectors.length === 0 || clusters.length === 0) {
//                 return 0;
//             }
//             const score = clusteringUtility.calculateSilhouetteScore(vectors, clusters);
//             return typeof score === 'number' && !isNaN(score) ? Number(score.toFixed(3)) : 0;
//         } catch (error) {
//             console.error('Error calculating silhouette score:', error);
//             return 0;
//         }
//     }

//     private safeCalculateDaviesBouldinIndex(vectors: number[][], clusters: any[]): number {
//         try {
//             if (!vectors || !clusters || vectors.length === 0 || clusters.length === 0) {
//                 return 0;
//             }
//             const index = clusteringUtility.calculateDaviesBouldinIndex(vectors, clusters);
//             return typeof index === 'number' && !isNaN(index) ? Number(index.toFixed(3)) : 0;
//         } catch (error) {
//             console.error('Error calculating Davies-Bouldin index:', error);
//             return 0;
//         }
//     }

//     private isValidCoordinate(coord: number | null | undefined): boolean {
//         return typeof coord === 'number' && !isNaN(coord) && coord >= 0 && coord <= 10000;
//     }

//     private calculateClusterSizes(clusters: any[]): number[] {
//         try {
//             if (!clusters || !Array.isArray(clusters)) {
//                 return [];
//             }
//             return clusters.map(cluster => (cluster && Array.isArray(cluster) ? cluster.length : 0));
//         } catch (error) {
//             console.error('Error calculating cluster sizes:', error);
//             return [];
//         }
//     }

//     async getUserPatterns(webId: number): Promise<SessionPattern[]> {
//         const rawData = await clusteringDal.getUserPatterns(webId);
//         return await clusteringUtility.analyzeSessionPatterns(rawData);
//     }

//     async getTemporalAnalysis(webId: number, timeUnit: string): Promise<TemporalMetrics[]> {
//         const temporalData = await clusteringDal.getTemporalAnalysis(webId, timeUnit);
//         return await clusteringUtility.analyzeTemporalData(temporalData);
//     }

//     async getAnalysisSummary(webId: number): Promise<{
//         userSegments: SessionPattern[];
//         interactionClusters: ClusterAnalysis;
//         temporalMetrics: TemporalMetrics[];
//         recommendations: string[];
//         anomalies: any[];
//     }> {
//         const patterns = await clusteringDal.getUserPatterns(webId);
//         const interactions = await clusteringDal.getInteractionClusters(webId);
//         const temporal = await clusteringDal.getTemporalAnalysis(webId, 'day');

//         const processedInteractions = this.processInteractionData(interactions);

//         return await clusteringUtility.generateAnalysisSummary(
//             patterns,
//             processedInteractions.clusters,
//             temporal
//         );
//     }

//     private processInteractionData(rawData: any[]): {
//         clusters: Array<Array<{
//             x_coord: number;
//             y_coord: number;
//             duration: number;
//         }>>;
//     } {
//         try {
//             if (!rawData || !Array.isArray(rawData)) {
//                 return { clusters: [] };
//             }

//             const clusterMap = new Map<number, Array<{
//                 x_coord: number;
//                 y_coord: number;
//                 duration: number;
//             }>>();

//             rawData.forEach(row => {
//                 if (!row || !row.x_coords || !row.y_coords || !row.durations) {
//                     return;
//                 }

//                 const points = [];
//                 for (let i = 0; i < row.x_coords.length; i++) {
//                     if (
//                         this.isValidCoordinate(row.x_coords[i]) &&
//                         this.isValidCoordinate(row.y_coords[i]) &&
//                         typeof row.durations[i] === 'number'
//                     ) {
//                         points.push({
//                             x_coord: Number(row.x_coords[i]),
//                             y_coord: Number(row.y_coords[i]),
//                             duration: Number(row.durations[i])
//                         });
//                     }
//                 }

//                 if (points.length > 0) {
//                     clusterMap.set(row.cluster_id || 0, points);
//                 }
//             });

//             const clusters = Array.from(clusterMap.values());
//             const validClusters = clusters
//                 .filter(cluster => cluster && cluster.length > 0)
//                 .map(cluster =>
//                     cluster.filter(point =>
//                         this.isValidCoordinate(point.x_coord) &&
//                         this.isValidCoordinate(point.y_coord) &&
//                         point.duration > 0
//                     )
//                 )
//                 .filter(cluster => cluster.length > 0);

//             return { clusters: validClusters };
//         } catch (error) {
//             console.error('Error processing interaction data:', error);
//             return { clusters: [] };
//         }
//     }
// }



// const clusteringService = new ClusteringService();
// export default clusteringService;


// import {  } from '..';
// import {  } from '../data/@types/cluster.dao';
// import { C } from './untils/clustering.utility';

// export class ClusteringService {
//     constructor(
//         private readonly clusteringDal: ClusteringDal,
//         private readonly clusteringUtility: ClusteringUtility
//     ) {}

//     /**
//      * Получает и анализирует кластеры взаимодействий
//      */
//     async getInteractionClusters(webId: number, clusterCount: number): Promise<ClusterAnalysis> {
//         try {
//             const interactionData = await this.clusteringDal.getInteractionClusters(webId);

//             if (!interactionData || interactionData.length === 0) {
//                 return this.getEmptyAnalysis();
//             }

//             const clusters = this.transformToClusters(interactionData);

//             if (clusters.length === 0) {
//                 return this.getEmptyAnalysis();
//             }

//             const vectors = this.extractVectors(clusters);
//             const metrics = this.calculateClusterMetrics(clusters, vectors);

//             return {
//                 clusters,
//                 metrics,
//                 outliers: this.detectOutliers(clusters)
//             };
//         } catch (error) {
//             console.error('Error in getInteractionClusters:', error);
//             throw new Error(`Failed to get interaction clusters: ${error.message}`);
//         }
//     }

//     /**
//      * Преобразует данные из DAL в формат кластеров
//      */
//     private transformToClusters(interactionData: ClusterInteraction[]): Cluster[] {
//         return interactionData.map(cluster => ({
//             sessions: this.transformSessionData(cluster.session_data),
//             centroid: [cluster.center_x, cluster.center_y] as [number, number]
//         }));
//     }

//     /**
//      * Преобразует данные сессий
//      */
//     private transformSessionData(sessionData: any[]): ClusterSession[] {
//         return sessionData.map(session => ({
//             sessionId: session.sessionId,
//             metrics: {
//                 avgDuration: session.metrics.duration,
//                 interactionCount: session.metrics.interactionCount,
//                 uniqueElements: session.metrics.uniqueElements,
//                 x: session.metrics.x,
//                 y: session.metrics.y
//             }
//         }));
//     }

//     /**
//      * Извлекает векторы координат из кластеров
//      */
//     private extractVectors(clusters: Cluster[]): number[][] {
//         return clusters.flatMap(cluster => 
//             cluster.sessions.map(session => [
//                 session.metrics.x,
//                 session.metrics.y
//             ])
//         );
//     }

//     /**
//      * Рассчитывает метрики кластеров
//      */
//     private calculateClusterMetrics(clusters: Cluster[], vectors: number[][]) {
//         return {
//             silhouetteScore: this.calculateSilhouetteScore(vectors, clusters),
//             daviesBouldinIndex: this.calculateDaviesBouldinIndex(vectors, clusters),
//             clusterSizes: this.calculateClusterSizes(clusters),
//             clusterDensity: this.calculateClusterDensities(clusters)
//         };
//     }

//     /**
//      * Рассчитывает показатель силуэта
//      */
//     private calculateSilhouetteScore(vectors: number[][], clusters: Cluster[]): number {
//         try {
//             return this.clusteringUtility.calculateSilhouetteScore(vectors, clusters);
//         } catch (error) {
//             console.warn('Failed to calculate silhouette score:', error);
//             return 0;
//         }
//     }

//     /**
//      * Рассчитывает индекс Дэвиса-Болдина
//      */
//     private calculateDaviesBouldinIndex(vectors: number[][], clusters: Cluster[]): number {
//         try {
//             return this.clusteringUtility.calculateDaviesBouldinIndex(vectors, clusters);
//         } catch (error) {
//             console.warn('Failed to calculate Davies-Bouldin index:', error);
//             return 0;
//         }
//     }

//     /**
//      * Рассчитывает размеры кластеров
//      */
//     private calculateClusterSizes(clusters: Cluster[]): number[] {
//         return clusters.map(cluster => cluster.sessions.length);
//     }

//     /**
//      * Рассчитывает плотность кластеров
//      */
//     private calculateClusterDensities(clusters: Cluster[]): number[] {
//         return clusters.map(cluster => {
//             try {
//                 const points = cluster.sessions.map(session => [
//                     session.metrics.x,
//                     session.metrics.y
//                 ]);
//                 return this.clusteringUtility.calculateClusterDensity(points);
//             } catch (error) {
//                 console.warn('Failed to calculate cluster density:', error);
//                 return 0;
//             }
//         });
//     }

//     /**
//      * Определяет выбросы в данных
//      */
//     private detectOutliers(clusters: Cluster[]): any[] {
//         try {
//             const allPoints = this.extractVectors(clusters);
//             return this.clusteringUtility.detectOutliers(allPoints);
//         } catch (error) {
//             console.warn('Failed to detect outliers:', error);
//             return [];
//         }
//     }

//     /**
//      * Возвращает пустой анализ при отсутствии данных
//      */
//     private getEmptyAnalysis(): ClusterAnalysis {
//         return {
//             clusters: [],
//             metrics: {
//                 silhouetteScore: 0,
//                 daviesBouldinIndex: 0,
//                 clusterSizes: [],
//                 clusterDensity: []
//             },
//             outliers: []
//         };
//     }

//     /**
//      * Проверяет валидность входных данных
//      */
//     private validateInputData(webId: number, clusterCount: number): void {
//         if (!webId || webId <= 0) {
//             throw new Error('Invalid web ID');
//         }
//         if (!clusterCount || clusterCount <= 0) {
//             throw new Error('Invalid cluster count');
//         }
//     }
// }




import { ClusterResult, TemporalResult, TimeUnit } from './@types/clustering.dto'
import clusteringDal from '../data/clustering.dal';
import clusteringUtility from './utils/clustering.utility'
import * as clustering from 'density-clustering';

class ClusteringService {
    async getInteractionClusters(webId: number): Promise<ClusterResult> {
        // Получаем данные через DAL
        const interactions = await clusteringDal.getInteractions(webId);

        // Подготовка данных для DBSCAN
        const points = interactions.map(i => ({
            x: i.x,
            y: i.y,
            duration: i.duration
        }));

        // Конфигурация DBSCAN
        const dbscan = new clustering.DBSCAN();
        const neighborhoodRadius = 30;
        const minPointsPerCluster = 5;

        const clusterResults = dbscan.run(
            points.map(p => [p.x, p.y, p.duration]),
            neighborhoodRadius,
            minPointsPerCluster,
            clusteringUtility.calculateDistance
        );

        // Вычисляем метрики качества кластеризации
        const metrics = {
            silhouetteScore: clusteringUtility.calculateSilhouetteScore(clusterResults),
            daviesBouldinIndex: clusteringUtility.calculateDaviesBouldinIndex(clusterResults),
            clusterSizes: clusteringUtility.getClusterSizes(clusterResults)
        };

        return {
            clusters: clusteringUtility.formatClusters(clusterResults, points),
            metrics
        };
    }

    async getTemporalAnalysis(webId: number, timeUnit: keyof TimeUnit): Promise<TemporalResult[]> {
        const temporalData = await clusteringDal.getTemporalData(webId, timeUnit);

        return temporalData.map(data => ({
            time_bucket: clusteringUtility.formatTimeBucket(data.time_bucket, timeUnit),
            event_count: data.event_count,
            unique_users: data.unique_users
        }));
    }

    async getAnalysisSummary(webId: number): Promise<any> {
        const [interactionClusters, temporalData] = await Promise.all([
            this.getInteractionClusters(webId),
            this.getTemporalAnalysis(webId, 'day')
        ]);

        const metrics = await clusteringDal.getClusterMetrics(webId);

        return {
            clusters: {
                count: interactionClusters.clusters.length,
                metrics: interactionClusters.metrics,
                distribution: clusteringUtility.calculateClusterDistribution(interactionClusters)
            },
            temporal: {
                peakHours: clusteringUtility.findPeakHours(temporalData),
                activityTrend: clusteringUtility.calculateActivityTrend(temporalData)
            },
            metrics: clusteringUtility.summarizeMetrics(metrics)
        };
    }
};




const clusteringService = new ClusteringService();
export default clusteringService;