import 'mocha';
import chai from 'chai';
import { agent as request } from 'supertest';
import { Database } from "better-sqlite3"
import diConfig from '../src/config/di';
import { Express } from 'express';
import { createApp } from '../src/app';
import Container from 'typedi';
import { generateJwt } from '../src/helper/generateJwt';

let assert = chai.assert;

describe('Get Orders', () => {
    const path = '/orders';

    let db: Database;
    let app: Express;
    let validJwt: string;

    before(async () => {
        app = await createApp();
        db = Container.get(diConfig.database);

        validJwt = generateJwt({
            sub: 1,
            email: "john.doe@gmail.com",
            created_at: new Date(),
        });
    });

    describe('JWT validation', () => {
        it('should throw a 401 if "Authorization" is missing from header', async () => {
            const res = await request(app).get(path);
            assert.equal(res.status, 401);
            assert.equal(res.body.message, "Missing bearer token from request header");
        });
        it('should throw a 401 if "Authorization" is provided but does not start with "Bearer"', async () => {
            const res = await request(app)
                .get(path)
                .set("Authorization", `NotBearer ${validJwt}`);
            assert.equal(res.status, 401);
            assert.equal(res.body.message, "Missing bearer token from request header");
        });
        it('should throw a 401 if bearer token is provided, but is an invalid jwt', async () => {
            const res = await request(app)
                .get(path)
                .set("Authorization", "Bearer notJwt");
            assert.equal(res.status, 401);
            assert.equal(res.body.message, "User is unauthorized");
        });
    })
})
