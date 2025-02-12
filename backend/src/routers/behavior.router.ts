import { Router } from "express";
import authCheck from '../middlewares/auth.check';
import behaviorController from "../controllers/behavior.controller";

const behaviorRouter: Router = Router();

behaviorRouter.get('/m/loading', authCheck, behaviorController.getPageLoadingSpeed);
behaviorRouter.get('/m/total-users', authCheck, behaviorController.getTotalUsers);
behaviorRouter.get('/m/total-sessions', authCheck, behaviorController.getTotalVisits);
behaviorRouter.get('/m/returning', authCheck, behaviorController.getReturningUsers);
behaviorRouter.get('/m/bounce', authCheck, behaviorController.getBounceRate);
behaviorRouter.get('/m/sales', authCheck, behaviorController.getTotalSales);
behaviorRouter.get('/m/coversions', authCheck, behaviorController.getTotalConversions);
behaviorRouter.get('/m/activity', authCheck, behaviorController.getActiveUsers);


// behaviorRouter.get('/users', authCheck, behaviorController.get);



export default behaviorRouter;