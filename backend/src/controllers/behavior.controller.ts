import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import behaviorService from '../services/behavior.service';


class BehaviorController {
    @ControllerErrorHandler()
    async getPageLoadingSpeed(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getPageLoadingSpeed(webId);
        return res.status(200).json(result);
    }
    @ControllerErrorHandler()
    async getTotalUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getTotalUsers(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTotalVisits(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getTotalVisits(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getReturningUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getReturningUsers(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getBounceRate(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getBounceRate(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTotalSales(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getTotalSales(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTotalConversions(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getTotalConversions(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getActiveUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getActiveUsers(webId);
        return res.status(200).json(result);
    }
}

const behaviorController = new BehaviorController();
export default behaviorController;