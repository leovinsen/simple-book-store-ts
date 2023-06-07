import DatabaseConstructor, { Database } from "better-sqlite3"
import path from 'path';
import { globSync } from 'glob'
import config from '../config';
import fs from 'fs';

export const createDB = (): Database => {
    const db = new DatabaseConstructor(config.dbPath);
    db.exec("PRAGMA foreign_keys = ON");

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

    const teardown = () => {
        db.close();
        fs.rmSync(dbPath);
    }

    return { db, teardown };
}
