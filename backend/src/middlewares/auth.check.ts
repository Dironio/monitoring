import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import ApiError from "./ApiError";

function authCheck(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.headers.authorization);
        const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw ApiError.UnauthorizedError();
        }


        const userData: TokenPayload | null = authService.validateAccessToken(accessToken);
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }

        res.locals.tokenPayload = userData;
        console.log('Authentication was successful')
        next();
    } catch (err) {
        next(err);
    }
}

export default authCheck;