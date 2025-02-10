import { Router } from "express";
import authCheck from '../middlewares/auth.check';
import behaviorController from "../controllers/behavior.controller";

const behaviorRouter: Router = Router();

behaviorRouter.get('/returning-user', authCheck, behaviorController.getReturningUsers);
behaviorRouter.get('/total-users', authCheck, behaviorController.getTotalUsers);

export default behaviorRouter;