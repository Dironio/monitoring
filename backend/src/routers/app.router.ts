import { Router } from "express";
import appController from '../controllers/app.controller';

const appRouter: Router = Router();

appRouter.post('/', appController.create);
appRouter.get('/', appController.getAll);
appRouter.patch('/', appController.update);
appRouter.delete('/', appController.delete);

appRouter.get('/', appController.getOne);

export default appRouter;