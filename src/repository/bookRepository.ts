import { Database } from "sqlite3";
import { Service } from "typedi";
import Book from "../model/book";

@Service()
export default class BookRepository {
    private db: Database;

    constructor(
        db: Database
    ) {
        this.db = db;
    }

    public async getBooks(ids?: number[]): Promise<Book[]> {
        return new Promise<Book[]>((resolve, reject) => {
            let args: number[] = [];
            let query = "SELECT id, title, synopsis, author, price, created_at FROM books";

            if (ids) {
                const placeholders = ids.map(() => "?").join(",");
                query = `${query} WHERE id IN (${placeholders})`;
                args = ids;
            }

            this.db.all<Book>(query, args, (err, rows) => {
                if (err) {
                    return reject(err)
                }

                if (rows.length == 0) {
                    return resolve([]);
                }

                const newBooks = rows.map((book) => new Book(
                    book.id,
                    book.title,
                    book.synopsis,
                    book.author,
                    book.price / 100,
                    book.createdAt,
                ));
                resolve(newBooks);
            });
        });
    }
}
