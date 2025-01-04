import { Router } from "express";
import eventController from '../controllers/events.controller';
import authCheck from '../middlewares/auth.check';
import { checkRole } from "../middlewares/check.role";

const eventRouter: Router = Router();

eventRouter.post('/', eventController.create);
eventRouter.get('/', authCheck, eventController.getAll);
eventRouter.patch('/', authCheck, checkRole(['Владелец']), eventController.update);
eventRouter.delete('/:id', authCheck, checkRole(['Владелец']), eventController.delete);


eventRouter.get('/main/daily', authCheck, eventController.getActiveUsersDaily);
eventRouter.get('/main/duration', authCheck, eventController.getAverageSessionTime);
eventRouter.get('/main/top-pages', authCheck, eventController.getTopPages);
eventRouter.get('/main/average-time', authCheck, eventController.getAvgTime);


// eventRouter.get('/metrics/traffic', authCheck, eventController.getTrafficData);
// eventRouter.get('/metrics/user-segments', authCheck, eventController.getUserSegments);
// eventRouter.get('/metrics/event-summary', authCheck, eventController.getEventSummary);
// eventRouter.get('/metrics/popular-pages', authCheck, eventController.getPopularPages);

eventRouter.get('/:id', authCheck, checkRole(['Аналитик', 'Администратор', 'Владелец']), eventController.getOne);

export default eventRouter;