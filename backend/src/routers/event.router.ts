import { Router } from "express";
import eventController from '../controllers/events.controller';
import authCheck from '../middlewares/auth.check';

const eventRouter: Router = Router();

eventRouter.post('/', eventController.create);
eventRouter.get('/', authCheck, eventController.getAll);
eventRouter.patch('/', authCheck, eventController.update);
eventRouter.delete('/:id', authCheck, eventController.delete);

eventRouter.get('/:id', authCheck, eventController.getOne);

export default eventRouter;