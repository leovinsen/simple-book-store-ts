import 'mocha';
import chai from 'chai';
import { agent as request } from 'supertest';
import { Database } from 'sqlite3';
import { Express } from 'express';
import { createApp } from '../src/app';
import { faker } from '@faker-js/faker';
import Container from 'typedi';

let assert = chai.assert;

describe('Get Books', () => {
    const path = '/books';

    let db: Database;
    let app: Express;

    const title = "Lorem ipsum";
    const synopsis = "Lorem ipsum dolor sit amet";
    const author = faker.person.fullName();
    const price = 1000;

    before(async () => {
        app = await createApp();
        db = Container.get(Database);
    });

    it('should return a list of books', async () => {
        db.run("DELETE FROM books");

        const stmt = db.prepare("INSERT INTO books (`title`, `synopsis`, `author`, `price`) VALUES (?, ?, ?, ?)");
        stmt.run(title, synopsis, author, price);
        stmt.finalize();

        const res = await request(app).get(path);
        assert.equal(res.status, 200);
        assert.equal(res.body.data.length, 1);

        const book = res.body.data[0];
        assert.equal(book.title, title);
        assert.equal(book.synopsis, synopsis);
        assert.equal(book.author, author);
        assert.equal(book.price, price / 100);
    });
})
