import { Database } from 'sqlite3';
import config from '../config';

export const createDB = (): Database => {
    return new Database(config.dbPath);
}
