import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

/* TODO:
1. Разделить данный код по файлам
2. Сделать подгрузку товаров из БД
3. Добавить место где будет храниться айди исполнителя, чтобы туда ему отстук приходил, а то щас это статика */

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }
    handle(): void {

        // Кнопка /start
        this.bot.start(async (ctx) => {
            ctx.reply(`Добро пожаловать в DevOrderBot!`);
            await new Promise((resolve) => setTimeout(resolve,   500));
        
            const keyboard = Markup.keyboard([
                ['Профиль 👤'],
                ['Оформить заказ', 'История заказов']
            ]).resize();
        
            // Debug version
            // ctx.reply(`Что вы хотите сделать сегодня? ${ctx.message.chat.id}`,keyboard);
            ctx.reply(`Что вы хотите сделать сегодня?`,keyboard);
        });

    }
}