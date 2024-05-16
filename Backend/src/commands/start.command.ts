import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { DataBase } from "../Database";

export class StartCommand extends Command {
    private db: DataBase;

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
        this.db = new DataBase();
        console.log('Constructor called');
    }

    async handle(): Promise<void> {
        
        this.bot.start(async (ctx) => {
            const user = ctx.from;
            const telegramId = user?.id;
            const firstName = user?.first_name ?? ''; 
            const lastName = user?.last_name ?? '';
            const username = user?.username ?? '';
            const createTime = new Date();
            const updateTime = createTime;
            console.log(createTime);
            if (!telegramId) {
                ctx.reply("Could not retrieve your Telegram ID.");
                return;
            }

            // Проверка существует ли пользователь
            let existingUser = await this.db.getUserFromDb(telegramId);

            if (!existingUser) {
                // Создаём, если не существует
                await this.db.insertNewUser(telegramId, firstName, lastName, username, createTime, updateTime);
                existingUser = { id: telegramId, firstName, lastName, username, createTime, updateTime};
            } else {
                // Обновляем инфу, если существует
                await this.db.updateUser(telegramId, firstName, lastName, username);
            }

            ctx.replyWithPhoto('https://disk.yandex.com.am/i/SGPFMFPWJaNdyQ' ,{caption: `Добро пожаловать в DevOrderBot, ${existingUser.first_name}!`});
            await new Promise((resolve) => setTimeout(resolve,  500));

            const keyboard = Markup.keyboard([
                ['Профиль 👤'],
                ['Оформить заказ', 'История заказов'],
            ]).resize();

            ctx.reply(`Что вы хотите сделать сегодня?`, keyboard);
        });
    }
}