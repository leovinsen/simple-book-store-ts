import { Request, Response, NextFunction } from 'express';
import { validateEmail } from '../../validator/validateEmail';
import { CustomError } from '../../error/CustomError';
import { validatePassword } from '../../validator/validatePassword';
import Container from 'typedi';
import { validateFn } from '../../validator/validator';
import { AuthService, InvalidCredentialsError, UserNotFoundError } from '../../service/authService';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const validationError: Error | null = validateFn(
        () => validateEmail(email),
        () => validatePassword(password),
    );
    if (validationError != null) {
        return next(validationError);
    }

    const authService = Container.get(AuthService);
    try {
        const jwt = await authService.login(email, password);

        return res.status(200).json({
            "message": "Successfully logged in",
            "data": {
                "jwt": jwt,
            }
        })
    } catch (e) {
        if (e instanceof UserNotFoundError || e instanceof InvalidCredentialsError) {
            // Do not disclose to user whether or not the email actually exists in our database.
            return next(new CustomError(401, "Invalid email or password."));
        }

        return next(e);
    }
}
