import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { DataBase } from "../Database";

export class StartCommand extends Command {
    private db: DataBase;

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
        this.db = new DataBase();;
    }

    async handle(): Promise<void> {
        
        this.bot.start(async (ctx) => {
            const user = ctx.from;
            const telegramId = user?.id;
            const firstName = user?.first_name ?? ''; 
            const lastName = user?.last_name ?? '';
            const username = user?.username ?? '';

            if (!telegramId) {
                ctx.reply("Could not retrieve your Telegram ID.");
                return;
            }

            // Проверка существует ли пользователь
            let existingUser = await this.db.getUserFromDb(telegramId);

            if (!existingUser) {
                // Создаём, если не существует
                await this.db.insertNewUser(telegramId, firstName, lastName, username);
                existingUser = { id: telegramId, firstName, lastName, username };
            } else {
                // Обновляем инфу, если существует
                await this.db.updateUser(telegramId, firstName, lastName, username);
            }

            ctx.reply(`Добро пожаловать в DevOrderBot, ${existingUser.first_name}!`);
            await new Promise((resolve) => setTimeout(resolve,  500));

            const keyboard = Markup.keyboard([
                ['Профиль 👤'],
                ['Оформить заказ'],
                ['История заказов']
            ]).resize();

            ctx.reply(`Что вы хотите сделать сегодня?`, keyboard);
        });
    }
}