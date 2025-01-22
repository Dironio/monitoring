import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import clusteringService from "../services/clustering.service";


class ClusteringController {
    // @ControllerErrorHandler()
    // async getRawData(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //     const webId = Number(req.query.web_id);
    //     const timeRange = req.query.time_range as string;
    //     const result = await clusteringService.getRawData(webId, timeRange);
    //     return res.status(200).json(result);
    // }

    @ControllerErrorHandler()
    async getUserPatterns(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getUserPatterns(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getInteractionClusters(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const clusterCount = Number(req.query.cluster_count) || 3;
        const result = await clusteringService.getInteractionClusters(webId, clusterCount);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTemporalAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const timeUnit = req.query.time_unit as 'hour' | 'day' | 'week';
        const result = await clusteringService.getTemporalAnalysis(webId, timeUnit);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getAnalysisSummary(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getAnalysisSummary(webId);
        return res.status(200).json(result);
    }
}

const clusteringController = new ClusteringController();
export default clusteringController;