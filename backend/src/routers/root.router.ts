import { NextFunction, Request, Response, Router } from "express";
import ApiError from '../middlewares/ApiError'
import userRouter from './user.router';
import authRouter from './auth.router';
import eventRouter from './event.router';
import appRouter from './app.router';
import siteRouter from './site.router';

const rootRouter: Router = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/events', eventRouter);
rootRouter.use('/applications', appRouter);
rootRouter.use('/sites', siteRouter);





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