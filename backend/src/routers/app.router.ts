import { Router } from "express";
import appController from '../controllers/app.controller';
import authCheck from "../middlewares/auth.check";
import { checkRole } from "../middlewares/check.role";

const appRouter: Router = Router();

appRouter.post('/', authCheck, appController.create);
appRouter.get('/', authCheck, checkRole([4]), appController.getAll);
appRouter.patch('/', authCheck, checkRole([4]), appController.update);
appRouter.delete('/:id', authCheck, checkRole([4]), appController.delete);

appRouter.get('/:id', authCheck, checkRole([2, 3, 4]), appController.getOne);

export default appRouter;