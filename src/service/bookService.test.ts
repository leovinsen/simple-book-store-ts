import sinon, { SinonStubbedInstance } from "sinon";
import BookRepository from "../repository/bookRepository";
import { BookService } from "./bookService";
import PasswordHasher from "../helper/passwordHasher";
import { faker } from "@faker-js/faker";
import 'mocha';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import Book from "../model/book";

var expect = chai.expect;
chai.use(sinonChai);

describe('BookService', () => {
    let bookService: BookService;
    let bookRepository: SinonStubbedInstance<BookRepository>;

    const fakeBook = new Book(0, "Lorem ipsum", "Lorem ipsum dolor sit amet", faker.person.fullName(), 1000, new Date());

    beforeEach(() => {
        bookRepository = sinon.createStubInstance(BookRepository);
        bookService = new BookService(bookRepository);
    })

    describe('getBooks', () => {
        it('should return a list of all books', async () => {
            bookRepository.getBooks.returns(new Promise((resolve, reject) => {
                resolve([fakeBook]);
            }));

            const books = await bookService.getBooks();

            expect(bookRepository.getBooks).calledOnce;
            expect(books.length).equal(1);
        });
    })
});
