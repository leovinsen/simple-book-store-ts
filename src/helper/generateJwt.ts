import jwt from 'jsonwebtoken';
import { JwtPayload } from '../model/jwtPayload';
import config from '../config';

export const generateJwt = (payload: JwtPayload): string => {
    return jwt.sign(payload, config.jwtSecret);
};
