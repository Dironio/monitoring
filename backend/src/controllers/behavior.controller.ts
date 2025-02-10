import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import behaviorService from '../services/behavior.service';


class BehaviorController {
    @ControllerErrorHandler()
    async getReturningUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getReturningUsers(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTotalUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getTotalUsers(webId);
        return res.status(200).json(result);
    }
}

const behaviorController = new BehaviorController();
export default behaviorController;