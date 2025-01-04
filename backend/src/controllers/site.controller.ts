import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import siteService, { } from "../services/site.service";


class SiteController {
    @ControllerErrorHandler()
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await siteService.create(req.body);
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await siteService.getAll();
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await siteService.update(req.body);
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await siteService.delete(Number(req.params.id));
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async getOne(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await siteService.getOne(Number(req.params.id));
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async getFilteredSites(req: Request, res: Response, next: NextFunction): Promise<Response> {
        // const result = await siteService.getFilteredSites(Number(req.params.id));
        // return res.status(200).json(result);

        const user = res.locals.tokenPayload;

        const result = await siteService.getFilteredSites(user);
        return res.status(200).json(result);
    }

}

const siteController = new SiteController();
export default siteController;