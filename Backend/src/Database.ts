import { Client } from "pg";
import { DatabaseService } from "./config/config.database";

export class DataBase {
    client: Client;
    
    constructor() {
        const databaseService = new DatabaseService();
        this.client = new Client(databaseService.get());
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async end(): Promise<void> {
        try {
            await this.client.end();
            console.log('Соединение закрыто');
        } catch (error) {
            console.error('Не получилось закрыть соединение:', error);
            throw error;
        }
    }

    async query(sql: string,  params?: any[]): Promise<any> {
        return await this.client.query(sql, params);
    }

    async fetchServices(): Promise<any[]> {
        try {
            const result = await this.query('SELECT * FROM "Услуга"');
            return result.rows;
        } catch (error) {
            console.error('Ошибка при получении услуг:', error);
            throw error;
        }
    }      

    async searchServicesByName(searchTerm: string): Promise<any[]> {
        const result = await this.query(`SELECT * FROM "Услуга" WHERE name LIKE ${searchTerm}`);
        return result.rows;
    }

    async fetchServiceById(id: number): Promise<any> {
        const result = await this.query(`SELECT * FROM "Услуга" WHERE id = ${id}`,);
        return result.rows[0];
    }
    
    // Получение User
    async getUserFromDb(telegramId: number): Promise<any> {
        try {
            const result = await this.query(`SELECT * FROM "Заказчик" WHERE telegram_id = ${telegramId}`);
            return result.rows[0];
        } catch (error) {
            console.error('Не получилось получить заказчика из БД:', error);
            throw error;
        }
    }

    // Добавление User
    async insertNewUser(telegramId: number, firstName: string, lastName: string, username: string): Promise<void> {
        try {
            await this.query(`INSERT INTO "Заказчик" (telegram_id, first_name, last_name, username) VALUES ($1, $2, $3, $4)`, [telegramId, firstName, lastName, username]);
        } catch (error) {
            console.error('Не получилось добавить заказчика в БД:', error);
            throw error;
        }
    }
    
    // Обновление User
    async updateUser(telegramId: number, firstName: string, lastName: string, username: string): Promise<void> {
        try {
            await this.query(`UPDATE "Заказчик" SET first_name = $2, last_name = $3, username = $4 WHERE telegram_id = $1`, [telegramId, firstName, lastName, username]);
        } catch (error) {
            console.error('Не получилось обновить заказчика:', error);
            throw error;
        }
    }

    // Создание нового заказа
    async createNewOrder(clientId: number, serviceId: number): Promise<void> {
        try {
            await this.query(`INSERT INTO "Заказ" (client_id, service_id, status) VALUES ($1, $2, 'new')`, [clientId, serviceId]);
        } catch (error) {
            console.error('Не получилось добавить заказ:', error);
            throw error;
        }
    }

    // Подсчёт заказов
    async countOrdersForUser(userId: number): Promise<number> {
        try {
            const result = await this.query(`SELECT COUNT(*) FROM "Заказ" WHERE client_id = $1`, [userId]);
            return parseInt(result.rows[0].count);
        } catch (error) {
            console.error('Не получилось подсчитать кол-во заказов:', error);
            throw error;
        }
    }

}
