import { Router } from "express";
import eventController from '../controllers/events.controller';
import authCheck from '../middlewares/auth.check';
import { checkRole } from "../middlewares/check.role";

const eventRouter: Router = Router();

eventRouter.post('/', eventController.create);
eventRouter.get('/', authCheck, eventController.getAll);
eventRouter.patch('/', authCheck, checkRole(['Владелец']), eventController.update);
eventRouter.delete('/:id', authCheck, checkRole(['Владелец']), eventController.delete);

eventRouter.get('/:id', authCheck, checkRole(['Аналитик', 'Администратор', 'Владелец']), eventController.getOne);

export default eventRouter;