import DatabaseConstructor, { Database } from "better-sqlite3"
import path from 'path';
import { globSync } from 'glob'
import config from '../config';
import fs from 'fs';

/**
 * creates an appropriate Database instance given the current environment configuration.
 * @returns a connection to SQLite3 Database.
 */
export const createDB = (): Database => {
    return createSqliteConn(config.isE2e);
}

/**
 * Creates a connection to DB at config.dbPath. Creates a new 
 * file at config.dbPath if one does not exist.
 * 
 * When reset is true, a fresh DB will be created from scratch by deleting
 * the old DB if it exists.
 * 
 * @param reset whether or not the DB should be re-created from scratch.
 * @returns a connection to SQLite3 Database at config.dbPath.
 */
const createSqliteConn = (reset: boolean = false): Database => {
    if (reset) {
        // ensure a fresh DB is always created
        fs.rmSync(config.dbPath);
    }

    const db = new DatabaseConstructor(config.dbPath);
    db.exec("PRAGMA foreign_keys = ON");

    if (reset) {
        runMigrations(db);
    }

    return db;
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
export const createTestDB = async (uniqueId: string): Promise<{ db: Database, teardown: Teardown }> => {
    const dbPath = path.join(__dirname, `${uniqueId}.db`);
    const db: Database = new DatabaseConstructor(dbPath);

    runMigrations(db);

    const teardown = () => {
        db.close();
        fs.rmSync(dbPath);
    }

    return { db, teardown };
}

const runMigrations = (db: Database) => {
    const globPattern = path.join(__dirname, '**/*-up.sql');
    const sqlFilePaths: string[] = globSync(globPattern, {
        signal: AbortSignal.timeout(1000),
    });
    if (sqlFilePaths.length == 0) {
        throw new Error("No migrations file was found");
    }

    for (const filePath of sqlFilePaths) {
        const sqlQuery = fs.readFileSync(filePath).toString();
        db.exec(sqlQuery);
    }
}
