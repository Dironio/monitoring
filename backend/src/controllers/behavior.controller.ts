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

    @ControllerErrorHandler()
    async getDailyActiveUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const interval = req.query.interval as 'month' | 'week';

        if (!['month', 'week'].includes(interval)) {
            throw new Error('Неверный интервал. Допустимые значения: "month", "week".');
        }

        const result = await behaviorService.getDailyActiveUsers(webId, interval);
        return res.status(200).json(result);
    }






    @ControllerErrorHandler()
    async getAverageTimeOnSite(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const interval = req.query.interval as 'month' | 'week';

        if (!['month', 'week'].includes(interval)) {
            throw new Error('Неверный интервал. Допустимые значения: "month", "week".');
        }

        const result = await behaviorService.getAverageTimeOnSite(webId, interval);
        return res.status(200).json(result);
    }
    @ControllerErrorHandler()
    async getAveragePageDepth(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const interval = req.query.interval as 'month' | 'week';

        if (!['month', 'week'].includes(interval)) {
            throw new Error('Неверный интервал. Допустимые значения: "month", "week".');
        }
        const result = await behaviorService.getAveragePageDepth(webId, interval);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getClickAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const interval = req.query.interval as 'month' | 'week';

        if (!['month', 'week'].includes(interval)) {
            throw new Error('Неверный интервал. Допустимые значения: "month", "week".');
        }

        const result = await behaviorService.getClickAnalysis(webId, interval);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getEventAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const interval = req.query.interval as 'month' | 'week';

        if (!['month', 'week'].includes(interval)) {
            throw new Error('Неверный интервал. Допустимые значения: "month", "week".');
        }

        const result = await behaviorService.getEventAnalysis(webId, interval);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getAverageScrollPercentage(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const interval = req.query.interval as 'month' | 'week';

        if (!['month', 'week'].includes(interval)) {
            throw new Error('Неверный интервал. Допустимые значения: "month", "week".');
        }

        const result = await behaviorService.getAverageScrollPercentage(webId, interval);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getFormAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const interval = req.query.interval as 'month' | 'week';

        if (!['month', 'week'].includes(interval)) {
            throw new Error('Неверный интервал. Допустимые значения: "month", "week".');
        }

        const result = await behaviorService.getFormAnalysis(webId, interval);
        return res.status(200).json(result);
    }








    @ControllerErrorHandler()
    async getPerformanceMetrics(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getPerformanceMetrics(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getErrorAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getErrorAnalysis(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getUptimeStatus(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getUptimeStatus(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getResourceAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getResourceAnalysis(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getSeoAnalysis(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getSeoAnalysis(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getActiveUsersNow(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getActiveUsersNow(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getActiveUsersComparison(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getActiveUsersComparison(webId);
        return res.status(200).json(result);
    }








    @ControllerErrorHandler()
    async getUserGeolocation(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getUserGeolocation(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTopCountries(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getTopCountries(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getTopCities(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getTopCities(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getUserRegions(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getUserRegions(webId);
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getGeolocationComparison(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await behaviorService.getGeolocationComparison(webId);
        return res.status(200).json(result);
    }







}

const behaviorController = new BehaviorController();
export default behaviorController;