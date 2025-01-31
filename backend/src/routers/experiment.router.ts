import { Router } from "express";
import authCheck from '../middlewares/auth.check';
import experimentController from '../controllers/experiment.controller';

const experimentRouter: Router = Router();

experimentRouter.get('/surveys', authCheck, experimentController.getSurveysSelector);
experimentRouter.get('/survey-votes', authCheck, experimentController.getSurveyVotes);

export default experimentRouter;