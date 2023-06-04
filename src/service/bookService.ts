import { Service } from "typedi";
import Book from "../model/book";
import BookRepository from "../repository/bookRepository";

@Service()
class BookService {
    private _bookRepository: BookRepository;

    constructor(
        bookRepository: BookRepository,
    ) {
        this._bookRepository = bookRepository;
    }

    public async getBooks(): Promise<Book[]> {
        return await this._bookRepository.getBooks();
    }
}

export { BookService }
