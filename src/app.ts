import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createDB } from './database';
import { Container } from 'typedi';
import { Database } from "better-sqlite3"
import router from './route';
import { errorHandler } from './middleware/errorHandler';
import diConfig from './config/di';

export const createApp = async (): Promise<Express> => {
    const app: Express = express();

    app.get('/', (req: Request, res: Response) => {
        res.send('Welcome to Online Book Store');
    });

    app.use(bodyParser.json());
    app.use(router);
    app.use(errorHandler);

    const db: Database = createDB();
    Container.set<Database>(diConfig.database, db);

    return app;
}
