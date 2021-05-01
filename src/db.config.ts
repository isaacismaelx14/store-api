import { config } from './database/';

const dbConfig: config = {
    host: 'localhost',
    user: process.env.USER_DATABASE || 'root',
    password: process.env.PWD_DATABASE || '',
    database: 'store_db',
};

export default dbConfig;
