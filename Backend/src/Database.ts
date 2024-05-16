import { Client } from "pg";
import { DatabaseService } from "./config/config.database";

export class DataBase {
    client: Client;
    
    constructor() {
        const databaseService = new DatabaseService();
        this.client = new Client(databaseService.get());
        this.client.connect(); // Подключаем клиент один раз при инициализации
    }

    async query(sql: string, params?: any[]): Promise<any> {
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
        try {
            const result = await this.query(`SELECT * FROM "Услуга" WHERE name LIKE $1`, [`%${searchTerm}%`]);
            return result.rows;
        } catch (error) {
            console.error('Ошибка при поиске услуг по имени:', error);
            throw error;
        }
    }

    async fetchServiceById(id: number): Promise<any> {
        try {
            const result = await this.query(`SELECT * FROM "Услуга" WHERE id = $1`, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Ошибка при получении услуги по ID:', error);
            throw error;
        }
    }

    async getUserFromDb(telegramId: number): Promise<any> {
        try {
            const result = await this.query(`SELECT * FROM "Заказчик" WHERE telegram_id = $1`, [telegramId]);
            return result.rows[0];
        } catch (error) {
            console.error('Не получилось получить заказчика из БД:', error);
            throw error;
        }
    }

    async insertNewUser(telegramId: number, firstName: string, lastName: string, username: string, createTime: Date, updateTime: Date): Promise<void> {
        try {
            // Исправление названия столбца с "createdat" на "createdAt"
            await this.query(`INSERT INTO "Заказчик" (telegram_id, first_name, last_name, username, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)`, [telegramId, firstName, lastName, username, createTime.toISOString(), updateTime.toISOString()]);
        } catch (error) {
            console.error('Не получилось добавить заказчика в БД:', error);
            throw error;
        }
    }

    async updateUser(telegramId: number, firstName: string, lastName: string, username: string): Promise<void> {
        try {
            await this.query(`UPDATE "Заказчик" SET first_name = $2, last_name = $3, username = $4 WHERE telegram_id = $1`, [telegramId, firstName, lastName, username]);
        } catch (error) {
            console.error('Не получилось обновить заказчика:', error);
            throw error;
        }
    }

    async createNewOrder(clientId: number, serviceId: number): Promise<void> {
        try {
            const clientExists = await this.query(`SELECT id FROM "Заказчик" WHERE telegram_id = $1`, [clientId]);
            if (!clientExists.rows.length) {
                await this.query(`INSERT INTO "Заказчик" (id) VALUES ($1)`, [clientId]);
            } else {
                const clientId = clientExists.rows[0].id;
            }
            const insertOrderResult = await this.query(`INSERT INTO "Заказ" (client_id, service_id, order_date, status, "createdAt", "updatedAt") VALUES ($1, $2, $3, 'new', $4, $5) RETURNING id`, [clientId, serviceId, new Date().toISOString(), new Date().toISOString(), new Date().toISOString()]);
            return insertOrderResult.rows[0].id;
        } catch (error) {
            console.error('Не получилось добавить заказ:', error);
            throw error;
        }
    }

    async countOrdersForUser(userId: number): Promise<number> {
        try {
            const clientExists = await this.query(`SELECT id FROM "Заказчик" WHERE telegram_id = $1`, [userId]);
            const clientId = clientExists.rows[0].id;
            const result = await this.query(`SELECT COUNT(*) FROM "Заказ" WHERE client_id = $1`, [clientId]);
            return parseInt(result.rows[0].count);
        } catch (error) {
            console.error('Не получилось подсчитать кол-во заказов:', error);
            throw error;
        }
    }

    async showOrdersHistory(userId: number, page: number =  1, pageSize: number =  3): Promise<{ orders: any[], totalOrders: number }> {
        try {
            const clientExists = await this.query(`SELECT id FROM "Заказчик" WHERE telegram_id = $1`, [userId]);
            if (!clientExists.rows.length) {
                throw new Error("Клиент не найден.");
            }
            const clientId = clientExists.rows[0].id;
            const orders = await this.query(`SELECT * FROM "Заказ" WHERE client_id = $1 ORDER BY order_date DESC LIMIT $2 OFFSET $3`, [clientId, pageSize, (page -  1) * pageSize]);
            const totalOrdersResult = await this.query(`SELECT COUNT(*) FROM "Заказ" WHERE client_id = $1`, [clientId]);
            const totalOrders = parseInt(totalOrdersResult.rows[0].count,  10);
            return { orders: orders.rows, totalOrders };
        } catch (error) {
            console.error('Ошибка при получении истории заказов:', error);
            throw error;
        }
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
}
