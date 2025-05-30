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
        const webId = Number(req.query.web_id);
        const result = await eventService.getAverageSessionTime(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTopPages(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await eventService.getTopPages(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    // async getAvgTime(req: Request, res: Response) {
    //     const webId = Number(req.query.web_id);
    //     const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    //     const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    //     // Валидация дат
    //     if (startDate && isNaN(startDate.getTime()) || endDate && isNaN(endDate.getTime())) {
    //         return res.status(400).json({ error: "Invalid date format" });
    //     }

    //     const result = await eventService.getAvgTime(webId, startDate, endDate);
    //     return res.status(200).json(result);
    // }



    async getAvgTime(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await eventService.getAvgTime(webId);
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
    async getUniquePages(req: Request, res: Response, next: NextFunction): Promise<Response> {
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


    // async getScrollHeatmap(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //     const webId = Number(req.query.web_id);
    //     const pageUrl = String(req.query.page_url);

    //     if (!webId || !pageUrl) {
    //         return res.status(400).json({ error: 'Missing required parameters' });
    //     }

    //     const data = await eventService.getScrollHeatmap(webId, pageUrl);;
    //     return res.status(200).json(data);
    // }
    @ControllerErrorHandler()
    async getScrollHeatmap(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const pageUrl = String(req.query.page_url);

        if (!webId || !pageUrl) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const result = await eventService.getScrollHeatmap(webId, pageUrl);
        return res.json(result);
    }

    // @ControllerErrorHandler()
    // async const getScrollHeatmap = async (req: Request, res: Response) => {
    //     const { web_id, page_url } = req.query;
    //     if (!web_id || !page_url) {
    //         return res.status(400).json({ error: 'Missing web_id or page_url' });
    //     }

    //     const data = await eventService.getScrollHeatmapData(
    //         Number(web_id),
    //         String(page_url)
    //     );

    //     return res.status(200).json({
    //             points: data,
    //             maxDuration: Math.max(...data.map(d => d.total_duration),
    //                 totalDuration: data.reduce((sum, d) => sum + d.total_duration, 0)
    //             });
    // };





    @ControllerErrorHandler()
    async getPageHeatmap(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const pageUrl = String(req.query.page_url);
        const result = await eventService.getPageHeatmap(webId, pageUrl);
        return res.status(200).json(result);
    }





    @ControllerErrorHandler()
    async getHistorySessions(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await eventService.getHistorySessions(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getHistoryOneSession(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const sessionId = String(req.query.session_id);
        const result = await eventService.getHistoryOneSession(webId, sessionId);
        return res.status(200).json(result);
    }

}

const eventController = new EventController();
export default eventController;