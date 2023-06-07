import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.NODE_ENV !== 'e2e' ? process.env.DB_PATH : process.env.DB_PATH_E2E;
if (!dbPath) {
    throw Error("DB_PATH env is not provided");
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw Error("JWT_SECRET env is not provided");
}

export default {
    port: process.env.PORT || 8000,
    jwtSecret: jwtSecret,
    dbPath: dbPath,
    isE2e: process.env.NODE_ENV === 'e2e'
};
