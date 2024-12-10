import { CookieOptions, NextFunction, Request, Response } from "express";


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
}

const authController = new AuthController();
export default authController;