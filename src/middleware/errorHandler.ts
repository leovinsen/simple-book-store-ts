import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../error/validationError';
import { AlreadyExistsError } from '../error/alreadyExistsError';
import { NotFoundError } from '../error/notFoundError';
import { CustomError } from '../error/customError';
import { UnauthorizedError } from '../error/unauthorizedError';
import { MissingBearerTokenError } from '../error/missingBearerTokenError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode: number;
    if (err instanceof ValidationError) {
        statusCode = 400;
    } else if (err instanceof AlreadyExistsError) {
        statusCode = 400;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
    } else if (err instanceof CustomError) {
        statusCode = err.HttpStatusCode;
    } else if (err instanceof UnauthorizedError || err instanceof MissingBearerTokenError) {
        statusCode = 401;
    } else {
        statusCode = 500;
    }

    return res.status(statusCode).json({
        "message": err.message
    });
};
