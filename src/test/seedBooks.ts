import path from "path";
import { Database } from "sqlite3";
import fs from 'fs';

const seedTableBooks = (db: Database) => {
    const seedPath = path.join(__dirname, '..', 'database', 'seed', 'table-books-seed.sql');
    seedFn(db, seedPath);
}

const seedFn = (db: Database, sqlPath: string) => {
    const sqlQuery = fs.readFileSync(sqlPath).toString();
    db.exec(sqlQuery);
}

export { seedTableBooks }
