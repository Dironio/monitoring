import { NextFunction, Request, Response } from "express";
import ControllerErrorHandler from './tools/controllerErrorHandler';
import userService from '../services/user.service';
import bcrypt from 'bcrypt';


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

    // @ControllerErrorHandler()
    // async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //     const result = await userService.update(req.body);

    //     if (!result) {
    //         res.status(404).json({ message: "User not found" });
    //         return;
    //     }

    //     return res.status(200).json(result);
    // }

    @ControllerErrorHandler()
    async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const userId = Number(req.body.id);
        const updateData = {
            id: userId,
            username: req.body.username,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body
        };

        if (req.body.new_password) {
            const user = await userService.getOne(userId);

            if (!req.body.current_password) {
                return res.status(400).json({ message: "Необходимо указать текущий пароль" });
            }

            const isValidPassword = await bcrypt.compare(
                req.body.current_password.toString(),
                user.password
            );

            if (!isValidPassword) {
                return res.status(400).json({ message: "Неверный текущий пароль" });
            }

            updateData['password'] = req.body.new_password.toString();
        } else if (req.body.password) {
            updateData['password'] = req.body.password.toString();
        }

        const result = await userService.update(updateData);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(result);
    }


    @ControllerErrorHandler()
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const userId = Number(req.params.id);
        const result = await userService.delete(userId);

        if (!result) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        return res.status(200).json(result);
    }
}

const userController = new UserController();
export default userController;