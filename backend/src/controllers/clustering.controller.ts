// import { NextFunction, Request, Response } from "express";
// import ControllerErrorHandler from "./tools/controllerErrorHandler";
// import clusteringService from "../services/clustering.service";




// class ClusteringController {
//     // @ControllerErrorHandler()
//     // async getRawData(req: Request, res: Response, next: NextFunction): Promise<Response> {
//     //     const webId = Number(req.query.web_id);
//     //     const timeRange = req.query.time_range as string;
//     //     const result = await clusteringService.getRawData(webId, timeRange);
//     //     return res.status(200).json(result);
//     // }

//     @ControllerErrorHandler()
//     async getUserPatterns(req: Request, res: Response, next: NextFunction): Promise<Response> {
//         const webId = Number(req.query.web_id);
//         const result = await clusteringService.getUserPatterns(webId);
//         return res.status(200).json(result);
//     }

//     @ControllerErrorHandler()
//     async getInteractionClusters(req: Request, res: Response, next: NextFunction): Promise<Response> {
//         const webId = Number(req.query.web_id);
//         const clusterCount = Number(req.query.cluster_count) || 3;
//         const result = await clusteringService.getInteractionClusters(webId, clusterCount);
//         return res.status(200).json(result);
//     }

//     @ControllerErrorHandler()
//     async getTemporalAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
//         const webId = Number(req.query.web_id);
//         const timeUnit = (req.query.time_unit as 'hour' | 'day' | 'week') || 'hour';

//         if (!webId || isNaN(webId)) {
//             return res.status(400).json({ error: 'Invalid web_id parameter' });
//         }

//         if (!['hour', 'day', 'week'].includes(timeUnit)) {
//             return res.status(400).json({ error: 'Invalid time_unit parameter' });
//         }

//         const result = await clusteringService.getTemporalAnalysis(webId, timeUnit);
//         return res.status(200).json(result);
//     }

//     @ControllerErrorHandler()
//     async getAnalysisSummary(req: Request, res: Response, next: NextFunction): Promise<Response> {
//         const webId = Number(req.query.web_id);
//         const result = await clusteringService.getAnalysisSummary(webId);
//         return res.status(200).json(result);
//     }
// }


import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import clusteringService from "../services/clustering.service";
import clusteringUtility from "../services/utils/clustering.utility";

class ClusteringController {
    @ControllerErrorHandler()
    async getInteractionClusters(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService
            .getInteractionClusters(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTemporalAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const rawTimeUnit = String(req.query.time_unit) || 'hour';
        const timeUnit = clusteringUtility.validateTimeUnit(rawTimeUnit);
        const result = await clusteringService.getTemporalAnalysis(webId, timeUnit);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getAnalysisSummary(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getAnalysisSummary(webId);
        return res.status(200).json(result);
    }









    @ControllerErrorHandler()
    async getUserAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getUserAnalysis(Number(webId));
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getSequenceAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getSequenceAnalysis(Number(webId));
        return res.status(200).json(result);
    }








    @ControllerErrorHandler()
    async getSessionSimilarity(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getSessionSimilarity(Number(webId));
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getGeoMetrics(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getGeoMetrics(Number(webId));
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getPageSimilarity(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getPageSimilarity(Number(webId));
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getDeviceMetrics(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await clusteringService.getDeviceMetrics(Number(webId));
        return res.status(200).json(result);
    }


    @ControllerErrorHandler()
    async getUmap(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const { start_date, end_date, event_type } = req.query;

        const result = await clusteringService.getUmapData({
            webId,
            startDate: start_date as string | undefined,
            endDate: end_date as string | undefined,
            eventType: event_type as 'click' | 'scroll' | undefined
        });

        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getUmapById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const id = String(req.params.session_id);

        // if (isNaN(id)) {
        //   throw new BadRequestError('Invalid event ID');
        // }

        const result = await clusteringService.getUmapById(webId, id);

        if (!result) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.status(200).json(result);
    }


}

const clusteringController = new ClusteringController();
export default clusteringController;