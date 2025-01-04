import { Router } from "express";
import authCheck from '../middlewares/auth.check';
import { checkRole } from "../middlewares/check.role";
import siteController, { } from '../controllers/site.controller'

const siteRouter: Router = Router();

siteRouter.post('/', authCheck, siteController.create);
siteRouter.get('/', authCheck, siteController.getAll);

siteRouter.get('/web', authCheck, checkRole([1, 2, 3, 4]), siteController.getFilteredSites);

export default siteRouter;