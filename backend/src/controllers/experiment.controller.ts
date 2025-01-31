import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import experimentService from '../services/experiment.service';

class ExperimentController {
    @ControllerErrorHandler()
    async getSurveysSelector(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const result = await experimentService.getSurveysSelector(Number(webId));
        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async getSurveyVotes(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const webId = Number(req.query.web_id);
        const surveyId = Number(req.query.survey_id);

        const result = await experimentService.getSurveyVotes(webId, surveyId);
        return res.status(200).json(result);
    }
}

const experimentController = new ExperimentController();
export default experimentController;