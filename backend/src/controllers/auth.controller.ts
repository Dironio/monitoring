import { CookieOptions, NextFunction, Request, Response } from "express";
import ControllerErrorHandler from './tools/controllerErrorHandler';
import authService from '../services/auth.service';
import { CreateUserDto, LoginUserDto } from "../services/types/user.dto";
import userService from "../services/user.service";


class AuthController {
    private getTokenParams(val: string): [string, string, CookieOptions] {
        return ['accessToken', val, { maxAge: 30 * 24 * 3600 * 1000, httpOnly: true }];
    }

    @ControllerErrorHandler()
    async signup(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const dto: CreateUserDto = req.body;
        const result = await authService.signup(dto);

        res.cookie(...this.getTokenParams(result.tokens.accessToken));
        return res.status(201).json(result);
    }

    @ControllerErrorHandler()
    async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const dto: LoginUserDto = req.body;
        const result = await authService.login(dto);

        res.cookie(...this.getTokenParams(result.tokens.accessToken));
        return res.status(200).json({
            user: result.user,
            accessToken: result.tokens.accessToken,
        });
    }

    @ControllerErrorHandler()
    async logout(req: Request, res: Response, next: NextFunction): Promise<Response> {
        res.clearCookie('accessToken');
        return res.json({ message: 'Logout success' });
    }

    @ControllerErrorHandler()
    async current(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const tokenPayload = res.locals.tokenPayload;
        const user = await userService.getOne(tokenPayload.id);

        return res.json(user);
    }

    @ControllerErrorHandler()
    async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { username, email } = req.body;
        const results: { username?: boolean; email?: boolean } = {};
        const messages: { username?: string; email?: string } = {};

        if (username) {
            const existingUserByUsername = await userService.getUserByUsername(username);
            results.username = !existingUserByUsername;
            messages.username = existingUserByUsername
                ? "Этот логин уже занят"
                : "Логин доступен";
        }

        if (email) {
            const existingUserByEmail = await userService.getUserByEmail(email);
            results.email = !existingUserByEmail;
            messages.email = existingUserByEmail
                ? "Эта почта уже зарегистрирована"
                : "Почта доступна";
        }

        // return res.status(200).json()
        return res.status(200).json({
            results,
            messages,
        });
    }



}

const authController = new AuthController();
export default authController;