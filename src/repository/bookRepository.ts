import { Database } from "better-sqlite3";
import { Inject, Service } from "typedi";
import Book from "../model/book";
import diConfig from "../config/di";

@Service()
export default class BookRepository {
    private db: Database;

    constructor(
        @Inject(diConfig.database)
        db: Database
    ) {
        this.db = db;
    }

    public async getBooks(ids?: number[]): Promise<Book[]> {
        let query = "SELECT id, title, synopsis, author, price, created_at FROM books";
        let args: number[] = [];
        if (ids) {
            const placeholders = ids.map(() => "?").join(",");
            query = `${query} WHERE id IN (${placeholders})`;
            args = ids;
        }

        try {
            const rows = this.db.prepare(query).all(args);
            if (rows.length == 0) {
                return [];
            }

            const castRows = rows as [{ [key: string]: any }];
            return castRows.map((row) => new Book(
                row.id,
                row.title,
                row.synopsis,
                row.author,
                row.price / 100,
                new Date(row.createdAt),
            ));

        } catch (e) {
            throw Error(`Failed to get list of books, e: ${e}`);
        }
    }
}
