import { Router } from "express";
import eventController from '../controllers/events.controller';
import authCheck from '../middlewares/auth.check';
import { checkRole } from "../middlewares/check.role";
import clusteringRouter from './clustering.router';

const eventRouter: Router = Router();

eventRouter.post('/', eventController.create);
eventRouter.get('/', authCheck, eventController.getAll);
eventRouter.patch('/', authCheck, checkRole([4]), eventController.update);
eventRouter.delete('/:id', authCheck, checkRole([4]), eventController.delete);


eventRouter.get('/main/daily', authCheck, eventController.getActiveUsersDaily);
eventRouter.get('/main/duration', authCheck, eventController.getAverageSessionTime);
eventRouter.get('/main/top-pages', authCheck, eventController.getTopPages);
eventRouter.get('/main/average-time', authCheck, eventController.getAvgTime);

eventRouter.get('/analysis', authCheck, eventController.getAnalysisData);


eventRouter.get('/pages', authCheck, eventController.getUniquePages);
eventRouter.get('/click-heatmap', authCheck, eventController.getClickHeatmap);
eventRouter.get('/scroll-heatmap', authCheck, eventController.getScrollHeatmap);
eventRouter.get('/page-heatmap', authCheck, eventController.getPageHeatmap);


eventRouter.get('/history/sessions', authCheck, eventController.getHistorySessions);
eventRouter.get('/history/user-session', authCheck, eventController.getHistoryOneSession);
// eventRouter.get('/history/page-sequence', authCheck, eventController.getPageSequence);
// eventRouter.get('/history/session', authCheck, eventController.getHistorySession);


eventRouter.use('/clustering', clusteringRouter);
eventRouter.use('/sequence', clusteringRouter);
eventRouter.use('/similarity', authCheck, clusteringRouter)

// eventRouter.get('/metrics/traffic', authCheck, eventController.getTrafficData);
// eventRouter.get('/metrics/user-segments', authCheck, eventController.getUserSegments);
// eventRouter.get('/metrics/event-summary', authCheck, eventController.getEventSummary);
// eventRouter.get('/metrics/popular-pages', authCheck, eventController.getPopularPages);

// eventRouter.get('/:id', authCheck, checkRole([2, 3, 4]), eventController.getOne);

export default eventRouter;