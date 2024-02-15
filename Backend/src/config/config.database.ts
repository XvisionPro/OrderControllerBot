import { config, DotenvParseOutput } from "dotenv";

export class DatabaseService {
    private config: DotenvParseOutput;
    constructor() {
        const { error, parsed} = config();
        if (error){
            throw new Error("Не найден файл .env");
        }
        if(!parsed){
            throw new Error("Пустой файл .env");
        }
        this.config = parsed;
    }
 
    get(): object {
        const res = {host: this.config['DATABASE_HOST'],
        port: this.config['DATABASE_PORT'],
        database: this.config['DATABASE_DB'],
        user: this.config['DATABASE_USER'],
        password: this.config['DATABASE_PASS'],
        }
        if(!res){
            throw new Error("Нет такого ключа");
        } 
        return res;
    }
// this.config[key];
}