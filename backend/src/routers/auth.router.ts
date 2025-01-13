import { Router } from "express";
import authController from '../controllers/auth.controller';
import authCheck from '../middlewares/auth.check';

const authRouter: Router = Router()

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.get('/logout', authCheck, authController.logout);
authRouter.get('/current', authCheck, authController.current);

authRouter.post('/check', authController.checkAvailability);

export default authRouter