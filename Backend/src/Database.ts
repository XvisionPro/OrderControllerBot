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

    async query(sql: string): Promise<any> {
        return await this.client.query(sql);
    }
}
