import 'mocha';
import chai from 'chai';
import { Teardown, createTestDB } from '../database';
import { Database } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import BookRepository from './bookRepository';
import fs from 'fs';
import path from 'path';

let assert = chai.assert;

describe('BookRepository', () => {
    let db: Database;
    let teardown: Teardown;

    let bookRepository: BookRepository;

    before(async () => {
        const database = await createTestDB(uuidv4());
        db = database.db;
        teardown = database.teardown;

        bookRepository = new BookRepository(db);
    });

    after(() => {
        teardown();
    });

    describe('getBooks', () => {
        it('should return all books in the database', async () => {
            // there are 3 records in seed values
            const seedPath = path.join(__dirname, '..', 'database', 'seed', 'table-books-seed.sql');
            const seedSql = fs.readFileSync(seedPath).toString();
            db.exec(seedSql);

            const books = await bookRepository.getBooks();
            assert.equal(books.length, 3);
        });
    });
});
