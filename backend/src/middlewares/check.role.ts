import { TokenPayload } from '../services/@types/tokenPayload';
import { UserRole } from '../services/@types/user.dto';
import { NextFunction, Request, Response } from "express";
import ApiError from "../middlewares/ApiError";

function checkRole(roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const tokenPayload: TokenPayload = res.locals.tokenPayload;

        if (!roles.includes(tokenPayload.role)) {
            const err = ApiError.Forbidden('Недостаточно прав');
            next(err);
        } else {
            next();
        }
    }
}

export { checkRole };