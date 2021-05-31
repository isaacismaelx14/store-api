import { config } from './database/';
import dotenv from 'dotenv';

dotenv.config();
// const dbConfig: config = {
//     host: '192.168.1.3',
//     user: process.env.USER_DATABASE || 'tostore',
//     password: process.env.PWD_DATABASE || 'Admin.st0re.com',
//     database: 'store_db',
// };

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

