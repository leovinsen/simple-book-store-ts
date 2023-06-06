import 'mocha';
import chai from 'chai';
import { agent as request } from 'supertest';
import { Express } from 'express';
import { createApp } from '../src/app';
import { AuthService } from '../src/service/authService';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import Container from 'typedi';

let assert = chai.assert;

describe('Login', () => {
    const path = '/auth/login';

    let app: Express;
    let authService: AuthService;

    before(async () => {
        app = await createApp();
        authService = Container.get(AuthService);
    });

    it('should return a JWT on successful login', async () => {
        const email = faker.internet.email();
        const password = uuidv4();

        await authService.registerUser(email, password);

        const res = await request(app).post(path).send({ email: email, password: password });
        assert.equal(res.status, 200);
        assert.isNotNull(res.body.jwt);
    });

    it('should throw a 401 if user does not exists in database', async () => {
        const res = await request(app).post(path).send({ email: faker.internet.email(), password: uuidv4() });
        assert.equal(res.status, 401);
        assert.equal(res.body.message, 'Invalid email or password.');
    });

    it('should throw a 401 if an invalid password is entered', async () => {
        const email = faker.internet.email();
        const wrongPassword = "wrongPass";
        await authService.registerUser(email, uuidv4());

        const res = await request(app).post(path).send({ email: email, password: wrongPassword });
        assert.equal(res.status, 401);
        assert.equal(res.body.message, 'Invalid email or password.');
    });

    it('should throw a 400 for empty email', async () => {
        const res = await request(app).post(path).send({ email: "", password: uuidv4() });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Email is required.');
    });

    it('should throw a 400 for invalid email', async () => {
        const res = await request(app).post(path).send({ email: "invalid", password: uuidv4() });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Email is invalid.');
    });

    it('should throw a 400 for empty password', async () => {
        const res = await request(app).post(path).send({ email: faker.internet.email(), password: "" });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Password is required.');
    });
})
