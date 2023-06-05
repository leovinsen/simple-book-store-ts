import config from "./config";
import { createApp } from './app';

const startServer = async () => {
    const port = config.port;
    const app = await createApp();
    app.listen(port, () => {
        console.log(`[server]:Server is running at https://localhost:${port}`);
    });
}

startServer();
