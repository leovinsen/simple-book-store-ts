import { Service } from "typedi";
import User from "../model/user";
import PasswordHasher from "../helper/passwordHasher";
import { NotFoundError } from "../error/notFoundError";
import { AlreadyExistsError } from "../error/alreadyExistsError";
import UserRepository from "../repository/userRepository";

class UserNotFoundError extends NotFoundError {
    constructor() {
        super("User");
    }
}

class UserAlreadyExistsError extends AlreadyExistsError {
    constructor() {
        super("User");
    }
}

class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid email and password combination.");
    }
}

@Service()
class AuthService {
    private _userRepository: UserRepository;
    private _passwordHasher: PasswordHasher;

    constructor(
        userRepository: UserRepository,
        passwordHasher: PasswordHasher
    ) {
        this._userRepository = userRepository;
        this._passwordHasher = passwordHasher;
    }

    public async login(email: string, password: string): Promise<string> {
        const user: User | null = await this._userRepository.findUserByEmail(email);
        if (user == null) {
            throw new UserNotFoundError();
        }

        const validPassword: boolean = this._passwordHasher.verifyHash(password, user.password);
        if (!validPassword) {
            throw new InvalidCredentialsError();
        }

        // TODO: implement JWT
        return "";
    }

    public async registerUser(email: string, password: string): Promise<User> {
        const checkUser = await this._userRepository.findUserByEmail(email);
        if (checkUser != null) {
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = this._passwordHasher.hash(password);

        return await this._userRepository.createUser(email, hashedPassword);
    }
}

export { AuthService, UserNotFoundError, UserAlreadyExistsError, InvalidCredentialsError }
