import { config } from './database/';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: config = {
    host: 'localhost',
    user: process.env.USER_DATABASE || 'root',
    password: process.env.PWD_DATABASE || '',
    database: 'store_db',
};

export const dbRequestConfig: config = {
    host: 'localhost',
    user: process.env.USER_DATABASE || 'root',
    password: process.env.PWD_DATABASE || '',
    database: 'store_requests',
};

export default dbConfig;

