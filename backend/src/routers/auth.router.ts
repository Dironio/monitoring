import { Router } from "express";

const authRouter: Router = Router()

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.get('/logout', authCheck, authController.logout);
authRouter.get('/current', authCheck, authController.current);

export default authRouter