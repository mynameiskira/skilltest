import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = process.env.DB_HOST
    ? new Sequelize(
        process.env.DB_NAME || 'skilltest',
        process.env.DB_USER || 'skilltest_user',
        process.env.DB_PASS || 'skilltest_password',
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false,
        }
    )
    : new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });

export default sequelize;
