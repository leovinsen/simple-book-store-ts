import 'mocha';
import chai from 'chai';
import supertest, { agent as request } from 'supertest';
import { Database } from "better-sqlite3";
import { Express } from 'express';
import { createApp } from '../src/app';
import Container from 'typedi';
import { generateJwt } from '../src/helper/generateJwt';
import diConfig from '../src/config/di';

let assert = chai.assert;

describe('Create Order', () => {
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
            const res = await request(app).post(path);
            assert.equal(res.status, 401);
            assert.equal(res.body.message, "Missing bearer token from request header");
        });
        it('should throw a 401 if "Authorization" is provided but does not start with "Bearer"', async () => {
            const res = await request(app)
                .post(path)
                .set("Authorization", `NotBearer ${validJwt}`);
            assert.equal(res.status, 401);
            assert.equal(res.body.message, "Missing bearer token from request header");
        });
        it('should throw a 401 if bearer token is provided, but is an invalid jwt', async () => {
            const res = await request(app)
                .post(path)
                .set("Authorization", "Bearer notJwt");
            assert.equal(res.status, 401);
            assert.equal(res.body.message, "User is unauthorized");
        });
    })

    describe('400 validation', () => {
        it('should throw error if duplicate book id is found', async () => {
            const duplicateId = 1;
            const res = await request(app)
                .post(path)
                .send({
                    "books": [
                        {
                            "id": duplicateId,
                            "qty": 1,
                        },
                        {
                            "id": duplicateId,
                            "qty": 2,
                        },
                    ]
                })
                .set("Authorization", `Bearer ${validJwt}`);

            assert.equal(res.status, 400);
            assert.equal(res.body.message, `Found duplicate entry for book with id: ${duplicateId}`);
        })

        it('should throw error if any of the requested book has missing id', async () => {
            const res = await request(app)
                .post(path)
                .send({
                    "books": [
                        {
                            "qty": 1,
                        },

                    ]
                })
                .set("Authorization", `Bearer ${validJwt}`);

            assert.equal(res.status, 400);
            assert.equal(res.body.message, `Book id is missing`);
        })

        it('should throw error if list of books is empty', async () => {
            const res = await request(app)
                .post(path)
                .send({
                    "books": []
                })
                .set("Authorization", `Bearer ${validJwt}`);

            assert.equal(res.status, 400);
            assert.equal(res.body.message, `No books were selected in the order`);
        })

        it('should throw error if list of books is empty', async () => {
            const res = await request(app)
                .post(path)
                .send({
                    "books": []
                })
                .set("Authorization", `Bearer ${validJwt}`);

            assert.equal(res.status, 400);
            assert.equal(res.body.message, `No books were selected in the order`);
        })
    })
})
