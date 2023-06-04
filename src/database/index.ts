import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';
import config from '../config';
import fs from 'fs';

export const createDB = (): Database => {
    return new Database(config.dbPath);
}

export type Teardown = () => void;

/**
 * Creates a DB for testing purposes and runs all migrations programatically.
 * 
 * Run the returned Teardown function to remove the file at the end of a test suite.
 * 
 * @param uniqueId a unique ID e.g. a UUID
 * @returns SQLite Database instance and a teardown function
 */
export const createTestDB = (uniqueId: string): { db: Database, teardown: Teardown } => {
    const dbPath = `${__dirname}/${uniqueId}.db`;
    const db = new Database(dbPath);

    db.exec(fs.readFileSync(__dirname + '/migrations/sqls/20230604105615-add-table-users-up.sql').toString());

    const teardown = () => {
        db.close();
        fs.rmSync(dbPath);
    }

    return { db, teardown };
}
