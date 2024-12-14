import { NextFunction, Request, Response, Router } from "express";
import ApiError from '../middlewares/ApiError'
import userRouter from './user.router';
import authRouter from './auth.router'

const rootRouter: Router = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);





rootRouter.use('*', (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.log) {
        console.log(404);
        res.locals.log = true;
        throw ApiError.NotFound();
    } else {
        next();
    }
});


export default rootRouter;