import jwt from 'jsonwebtoken';
import config from '../config';
import { NextFunction, Response, Request } from 'express';
import { MissingBearerTokenError } from '../error/missingBearerTokenError';
import { JwtPayload } from '../model/jwtPayload';
import { UnauthorizedError } from '../error/unauthorizedError';

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next(new MissingBearerTokenError());
    }

    const authHeaderArr = authHeader.split(' ');
    if (authHeaderArr[0] !== 'Bearer') {
        return next(new MissingBearerTokenError());
    }


    const token = authHeaderArr[1];
    try {
        const payload = jwt.verify(token, config.jwtSecret) as { [key: string]: any };
        req.jwtPayload = payload as JwtPayload;
        return next();
    } catch (err) {
        return next(new UnauthorizedError());
    }
};
