import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH;
if (!dbPath) {
    throw Error("DB_PATH env is not provided");
}

export default {
    port: process.env.PORT || 8000,
    dbPath: dbPath,
};
