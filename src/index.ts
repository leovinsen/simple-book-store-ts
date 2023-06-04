import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import config from './config';
import bodyParser from 'body-parser';
import { createDB } from './database';
import { Container } from 'typedi';
import { Database } from 'sqlite3';

const createApp = async (): Promise<Express> => {
    const app: Express = express();

    app.get('/', (req: Request, res: Response) => {
        res.send('Welcome to Online Book Store');
    });

    app.use(bodyParser.json());

    const db = createDB();
    Container.set(Database, db);

    return app;
}

const startServer = async () => {
    const port = config.port;
    const app = await createApp(); app.listen(port, () => {
        console.log(`[server]:Server is running at https://localhost:${port}`);
    });
}

startServer();

export default createApp;
