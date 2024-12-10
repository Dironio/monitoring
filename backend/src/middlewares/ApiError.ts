class ApiError extends Error {
    status: number;
    message: string;
    details: string[];

    constructor(status: number, message: string, details: string[]) {
        super();
        this.status = status;
        this.message = message;
        this.details = details;
    }

    static BadRequest(message: string = 'Bad request', details: string[] = []): ApiError {
        return new ApiError(400, message, details);
    }

    static UnauthorizedError(message: string = 'Unauthorized user', details: string[] = []): ApiError {
        return new ApiError(401, message, details);
    }

    static Forbidden(message: string = 'Forbidden', details: string[] = []): ApiError {
        return new ApiError(403, message, details);
    }

    static NotFound(message: string = 'Not found', details: string[] = []): ApiError {
        return new ApiError(404, message, details);
    }

    static TooManyRequests(message: string = 'Too many requests', details: string[] = []): ApiError {
        return new ApiError(429, message, details);
    }
}

export default ApiError;