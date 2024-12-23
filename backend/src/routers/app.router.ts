import { Router } from "express";
import appController from '../controllers/app.controller';
import authCheck from "../middlewares/auth.check";
import { checkRole } from "../middlewares/check.role";

const appRouter: Router = Router();

appRouter.post('/', authCheck, appController.create);
appRouter.get('/', authCheck, checkRole(['Владелец']), appController.getAll);
appRouter.patch('/', authCheck, checkRole(['Владелец']), appController.update);
appRouter.delete('/:id', authCheck, checkRole(['Владелец']), appController.delete);

appRouter.get('/:id', authCheck, checkRole(['Аналитик']), appController.getOne);

export default appRouter;