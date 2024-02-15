// DataBase Init

import { Client } from "pg"
import { DatabaseService } from "./config/config.database"

class DataBase{
    client: Client;
    
    constructor(){
        const databaseService = new DatabaseService()
        this.client = new Client(databaseService.get()) 
    }

    connect(): void {
        async () => await this.client.connect()
        }
}

const db = new DataBase();
db.connect();
const result = db.client.query('SELECT NOW()');
console.log(result);