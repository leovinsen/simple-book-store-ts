import 'mocha';
import chai from 'chai';
import { agent as request } from 'supertest';
import { Database } from 'sqlite3';
import { Express } from 'express';
import createApp from '../..';
import { AuthService } from '../../service/authService';
import { Teardown, createTestDB } from '../../database';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import Container from 'typedi';

let assert = chai.assert;

describe('Register', () => {
    let db: Database;
    let teardown: Teardown;

    let app: Express;
    let authService: AuthService;

    before(async () => {
        const database = await createTestDB(uuidv4());
        db = database.db;
        teardown = database.teardown;

        app = await createApp();
        authService = Container.get(AuthService);
    });

    after(() => {
        teardown();
    })


    it('should create a new user successfully', async () => {
        const res = await request(app).post('/auth/register').send({ email: faker.internet.email(), password: uuidv4() });
        assert.equal(res.status, 201);
        assert.equal(res.body.message, 'User created successfully');
    });

    it('should throw a 400 if user already exists in database', async () => {
        const email = faker.internet.email();
        const password = uuidv4();
        await authService.registerUser(email, password);

        const res = await request(app).post('/auth/register').send({ email: email, password: password });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'User already exists.');
    });

    it('should throw a 400 for empty email', async () => {
        const res = await request(app).post('/auth/register').send({ email: "", password: uuidv4() });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Email is required.');
    });

    it('should throw a 400 for invalid email', async () => {
        const res = await request(app).post('/auth/register').send({ email: "invalid", password: uuidv4() });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Email is invalid.');
    });

    it('should throw a 400 for empty password', async () => {
        const res = await request(app).post('/auth/register').send({ email: faker.internet.email(), password: "" });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Password is required.');
    });

    it('should throw a 400 for password not at least 8 chars long', async () => {
        const res = await request(app).post('/auth/register').send({ email: faker.internet.email(), password: "1234567" });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Password has to be at least 8 characters long.');
    });
})
