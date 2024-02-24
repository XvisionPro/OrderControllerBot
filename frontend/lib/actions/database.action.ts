import { DatabaseService } from '@/config/database.config';
import {Sequelize} from 'sequelize-typescript';

const databaseService = new DatabaseService();
const connection = new Sequelize(databaseService.get());

const checkConnection  =async (): Promise<void> => {
        try {
            await connection.sync();
            console.log("DB syncronized");
        } catch (error) {
            console.error(error);
        }
}

