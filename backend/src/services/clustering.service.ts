import { RawEvent } from "./@types/event.dto";
import clusteringDal from '../data/clustering.dal';
import { UserPattern, ClusterAnalysis, TemporalMetrics } from './@types/clustering.dto'
import clusteringUtility from './untils/clustering.utility';


class ClusteringService {
    async getUserPatterns(webId: number): Promise<UserPattern[]> {
        const rawData = await clusteringDal.getUserPatternData(webId);
        return await clusteringUtility.analyzeUserPatterns(rawData);
    }

    async getInteractionClusters(webId: number, clusterCount: number): Promise<ClusterAnalysis> {
        const interactionData = await clusteringDal.getInteractionData(webId);
        const vectors = await clusteringUtility.prepareVectorsForClustering(interactionData);
        return await clusteringUtility.performDBSCANClustering(vectors, clusterCount);
    }

    async getTemporalAnalysis(webId: number, timeUnit: string): Promise<TemporalMetrics[]> {
        const temporalData = await clusteringDal.getTemporalData(webId, timeUnit);
        return await clusteringUtility.analyzeTemporalData(temporalData);
    }

    async getAnalysisSummary(webId: number): Promise<any> {
        const patterns = await clusteringDal.getUserPatternData(webId);
        const interactions = await clusteringDal.getInteractionData(webId);
        const temporal = await clusteringDal.getTemporalData(webId, 'day');

        return await clusteringUtility.generateAnalysisSummary(patterns, interactions, temporal);
    }
}



const clusteringService = new ClusteringService();
export default clusteringService;