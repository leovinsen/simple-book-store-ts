import { Service } from "typedi";
import User from "../model/user";
import PasswordHasher from "../helper/passwordHasher";
import { NotFoundError } from "../error/notFoundError";
import { AlreadyExistsError } from "../error/alreadyExistsError";
import UserRepository from "../repository/userRepository";
import { generateJwt } from "../helper/generateJwt";

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

    /**
     * Finds a User with given email and password and verifies hash of the password
     * against the found User record's stored hash.
     * 
     * Returns a JWT Token containing User information if the password matches stored hash.
     * 
     * Throws a UserNotFoundError if a user with given email is not found.
     * Throws an InvalidCredentialsError if password does not match stored hash.
     * 
     * @param email user's email
     * @param password plaintext password
     * @returns a JWT token if email and password combination is valid
     */
    public async login(email: string, password: string): Promise<string> {
        const user: User | null = await this._userRepository.findUserByEmail(email);
        if (user == null) {
            throw new UserNotFoundError();
        }

        const validPassword: boolean = this._passwordHasher.verifyHash(password, user.password);
        if (!validPassword) {
            throw new InvalidCredentialsError();
        }

        return generateJwt({
            sub: user!.id,
            email: user!.email,
            created_at: user!.createdAt,
        });
    }

    /**
     * Registers a new User with given email and password.
     * 
     * Throws a UserAlreadyExistsError if a User with given email already exists.
     * 
     * @param email user'email. Must be unique
     * @param password plaintext password
     * @returns the created User record if successful
     */
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
