import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import appService from "../services/app.service";


class AppController {
    @ControllerErrorHandler()
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await appService.create(req.body);
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await appService.getAll();
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await appService.update(req.body);
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await appService.delete(Number(req.params.id));
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async getOne(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await appService.getOne(Number(req.params.id));
        return res.status(201).json(result);
    }
}

const appController = new AppController();
export default appController;