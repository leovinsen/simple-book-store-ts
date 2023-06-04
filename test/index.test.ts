import 'mocha';
import chai from 'chai';
import { agent as request } from 'supertest';
import createApp from '../src';

let assert = chai.assert;

describe('Sample test to verify app is working', () => {
    it('should return a 200 when / is requested', async () => {
        const app = await createApp();
        const res = await request(app).get('/').send();
        assert.equal(res.status, 200);
    })
})
