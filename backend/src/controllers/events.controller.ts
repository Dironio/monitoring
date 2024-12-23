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

}

const eventController = new EventController();
export default eventController;