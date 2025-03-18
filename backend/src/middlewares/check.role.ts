import { TokenPayload } from '../services/types/tokenPayload';
import { UserRole } from '../services/types/user.dto';
import { NextFunction, Request, Response } from "express";
import ApiError from "../middlewares/ApiError";

function checkRole(allowedRoleIds: number[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const tokenPayload: TokenPayload = res.locals.tokenPayload;
        // console.log('Token Payload in checkRole:', tokenPayload);
        // console.log('Allowed Roles:', allowedRoleIds);

        if (!allowedRoleIds.includes(tokenPayload.role_id)) {
            const err = ApiError.Forbidden('Недостаточно прав');
            // console.error('Access denied:', err.message);
            next(err);
        } else {
            // console.log('Access granted for role_id:', tokenPayload.role_id);
            next();
        }
    };
}

export { checkRole };