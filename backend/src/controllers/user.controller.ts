import { NextFunction, Request, Response } from "express";


class UserController {
    @ControllerErrorHandler()
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const candidate = await userService.create(req.body);

        return res.status(201).json(candidate);
    }

    @ControllerErrorHandler()
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const users = await userService.getAll();
        return res.status(200).json(users);
    }

    @ControllerErrorHandler()
    async getOne(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await userService.getOne(Number(req.params.id));

        if (!result) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const result = await userService.update(req.body);

        if (!result) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        return res.status(200).json(result);
    }

    @ControllerErrorHandler()
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const userId = Number(req.params.id);
        const result = await userService.delete(userId);

        // await cartService.delete({user_id: result.id})

        if (!result) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        return res.status(200).json(result);
    }
}

const userController = new UserController();
export default userController;