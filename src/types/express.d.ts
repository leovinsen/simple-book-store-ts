import { JwtPayload } from '../model/jwtPayload';

declare global {
    namespace Express {
        interface Request {
            jwtPayload: JwtPayload;
        }
    }
}
