import sinon, { SinonStubbedInstance, StubbableType } from "sinon";
import UserRepository from "../repository/userRepository";
import { AuthService, UserAlreadyExistsError } from "./authService";
import PasswordHasher from "../helper/passwordHasher";
import { faker } from "@faker-js/faker";
import 'mocha';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import User from "../model/user";

var expect = chai.expect;
chai.use(sinonChai);

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: SinonStubbedInstance<UserRepository>;
    let passwordHasher: SinonStubbedInstance<PasswordHasher>;

    const fakeEmail = faker.internet.email();
    const fakePassword = "password";
    const fakeHash = "hash";
    const fakeUser = new User(
        0,
        faker.internet.email(),
        fakePassword,
        new Date(),
    );

    beforeEach(() => {
        userRepository = sinon.createStubInstance(UserRepository);
        passwordHasher = sinon.createStubInstance(PasswordHasher);
        authService = new AuthService(userRepository, passwordHasher);
    })

    describe('registerUser', () => {
        it('should create a new user with email and hashed password', async () => {
            passwordHasher.hash.returns(fakeHash);
            userRepository.findUserByEmail.returns(new Promise((resolve, reject) => {
                resolve(null);
            }));
            userRepository.createUser.returns(new Promise((resolve, reject) => {
                resolve(fakeUser);
            }))


            const createdUser = await authService.registerUser(fakeEmail, fakePassword);

            expect(userRepository.findUserByEmail).to.have.been.calledWith(fakeEmail);
            expect(passwordHasher.hash).to.have.been.calledWith(fakePassword);
            expect(userRepository.createUser).to.have.been.calledWith(fakeEmail, fakeHash);
            expect(createdUser).equals(fakeUser);
        });

        it('should throw a UserAlreadyExistsError if userRepository.findUserByEmail returns a user', async () => {
            userRepository.findUserByEmail.returns(new Promise((resolve, reject) => {
                resolve(fakeUser);
            }));

            let error: unknown | null = null;
            try {
                const createdUser = await authService.registerUser(fakeEmail, fakePassword);
            } catch (e) {
                error = e;
            }

            expect(error).not.null;
            expect(error).instanceOf(UserAlreadyExistsError);
        });
    })

});
