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

    public async getBooks() {
        return new Promise<Book[]>((resolve, reject) => {
            this.db.all<Book>("SELECT id, title, synopsis, author, price, created_at FROM books", (err, rows) => {
                if (err) {
                    reject(err)
                }

                resolve(rows)
            });
        });
    }
}
