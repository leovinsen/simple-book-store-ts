import 'mocha';
import chai from 'chai';
import { Teardown, createTestDB } from '../database';
import { Database } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import BookRepository from './bookRepository';
import { seedTableBooks } from '../test/seedBooks';

let assert = chai.assert;

describe('BookRepository', () => {
    let db: Database;
    let teardown: Teardown;

    let bookRepository: BookRepository;

    before(async () => {
        const database = await createTestDB(uuidv4());
        db = database.db;
        teardown = database.teardown;

        // there are three books seeded in this function
        seedTableBooks(db)

        bookRepository = new BookRepository(db);
    });

    after(() => {
        teardown();
    });

    describe('getBooks', () => {
        it('should return all books in the database', async () => {
            const books = await bookRepository.getBooks();
            assert.equal(books.length, 3);
        });
    });
});
