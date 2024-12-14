import { Router } from "express";
import userController from "../controllers/user.controller";
import authCheck from '../middlewares/auth.check';


const userRouter = Router();

userRouter.post('/', userController.create);

userRouter.get('/',
    authCheck,
    //  roleCheck,
    userController.getAll);

userRouter.patch('/',
    authCheck,
    userController.update);

userRouter.delete('/:id',
    authCheck,
    userController.delete);


userRouter.get('/:id',
    authCheck,
    userController.getOne);

export default userRouter;