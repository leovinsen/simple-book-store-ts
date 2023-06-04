import { Request, Response, NextFunction } from 'express';
import { validatePassword } from '../../validator/validatePassword';
import { Container } from 'typedi';
import { validateFn } from '../../validator/validator';
import { validateEmail } from '../../validator/validateEmail';
import { AuthService } from '../../service/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
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
        const createdUser = await authService.registerUser(email, password);

        let userRedacted: any = Object.assign({}, createdUser);
        delete userRedacted.password;

        return res.status(201).json({
            "message": "User created successfully",
            "data": userRedacted,
        })
    } catch (e) {
        return next(e);
    }
}
