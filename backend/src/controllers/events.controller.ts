import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import eventService from "../services/event.service";


class EventController {
    @ControllerErrorHandler()
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.create(req.body);
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.getAll();
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.update(req.body);
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.delete(Number(req.params.id));
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async getOne(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.getOne(Number(req.params.id));
        return res.status(201).json(result);
    }


    ////////////////////////////////////////////////////////////////

    @ControllerErrorHandler()
    async getActiveUsersDaily(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await eventService.getActiveUsersDaily(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getAverageSessionTime(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.getAverageSessionTime();
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTopPages(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.getTopPages();
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getAvgTime(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await eventService.getAvgTime();
        return res.status(200).json(result);
    }







    @ControllerErrorHandler()
    async getTrafficData(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const data = await eventService.getTrafficData();
        return res.status(200).json(data);
    }

    @ControllerErrorHandler()
    async getUserSegments(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const data = await eventService.getUserSegments();
        return res.status(200).json(data);
    }

    @ControllerErrorHandler()
    async getEventSummary(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const data = await eventService.getEventSummary();
        return res.status(200).json(data);
    }

    @ControllerErrorHandler()
    async getPopularPages(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const data = await eventService.getPopularPages();
        return res.status(200).json(data);
    }




    @ControllerErrorHandler()
    async getAnalysisData(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        if (!webId || isNaN(webId)) {
            throw new Error(`Invalid webId: ${webId}`);
        }
        const data = await eventService.getAnalysisData(webId);
        return res.status(200).json(data);
    }










    @ControllerErrorHandler()
    async getPages(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await eventService.getUniquePages(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getClickHeatmap(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const pageUrl = String(req.query.page_url);
        const result = await eventService.getClickHeatmapData(webId, pageUrl);

        const formattedData = {
            points: result.map(item => ({
                x: item.eventData.x,
                y: item.eventData.y,
                count: item.clickCount
            })),
            maxCount: Math.max(...result.map(item => item.clickCount))
        };

        return res.status(200).json(formattedData);
    }

    @ControllerErrorHandler()
    async getScrollHeatmap(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const pageUrl = String(req.query.page_url);
        const result = await eventService.getScrollHeatmapData(webId, pageUrl);

        const formattedData = {
            points: result.map(item => ({
                scrollTop: item.eventData.scrollTop,
                scrollPercentage: item.eventData.scrollPercentage,
                count: item.scrollCount
            })),
            maxCount: Math.max(...result.map(item => item.scrollCount))
        };

        return res.status(200).json(formattedData);
    }

    @ControllerErrorHandler()
    async getPageHeatmap(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const pageUrl = String(req.query.page_url);
        const result = await eventService.getPageHeatmapData(webId, pageUrl);
        return res.status(200).json(result);
    }

}

const eventController = new EventController();
export default eventController;