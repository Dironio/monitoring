import { Router } from 'express';
import authCheck from '../middlewares/auth.check';
import InterfaceController from '../controllers/interface.controller';

const interfaceRouter = Router();

interfaceRouter.get('/interactions', authCheck, InterfaceController.getInteractions);
interfaceRouter.get('/scroll', authCheck, InterfaceController.getScrollData);
interfaceRouter.get('/element-stats', authCheck, InterfaceController.getElementStats);

export default interfaceRouter;