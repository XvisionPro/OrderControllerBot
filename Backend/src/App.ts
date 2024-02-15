import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import { ProfileCommand } from "./commands/profile.command";
import { OrderCommand } from "./commands/order.command";
import { DataBase } from "./Database";

class Bot{
    bot: Telegraf<IBotContext>;
    commands: Command[] = []

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
        this.bot.use(new LocalSession({database: 'sessions.json'}).middleware());
    }

    init(){
        this.commands = [new StartCommand(this.bot), new ProfileCommand(this.bot), new OrderCommand(this.bot)];
        for(const command of this.commands){
            command.handle();
        }
        this.bot.launch();
    }
}

// Пример использования БД
(async () => {
    const db = new DataBase();
    try {
        await db.connect();
        const result = await db.query('SELECT NOW()');
        console.log(result.rows[0]); 
    } catch (error) {
        console.error("Error executing query", error);
    } finally {
        await db.client.end(); 
    }
})();

