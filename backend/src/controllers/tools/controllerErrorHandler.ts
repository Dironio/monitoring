import { NextFunction, Request, Response } from "express";

export type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export default function ControllerErrorHandler(log: boolean = true) {
    return (
        target: Object,
        _: string | symbol,
        descriptor: TypedPropertyDescriptor<ControllerFunction>
    ): TypedPropertyDescriptor<ControllerFunction> | void => {
        const method = descriptor.value;
        descriptor.value = async (req, res, next) => {
            let result: any;

            res.locals.log = log;
            res.locals.pathFound = true;

            try {
                result = await method?.call(target, req, res, next);
                next();
            } catch (err) {
                if (err instanceof Error) {
                    next(err);
                }
            }

            return result;
        };
    };
}