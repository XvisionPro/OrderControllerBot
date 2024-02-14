import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { dealKeyboard, backKeyboard } from "../components/keyboards";
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
        
        // Если я правильно помню у нас в БД данные будут о пользователях, оттуда надо подтягивать
        this.bot.hears("Профиль 👤", (ctx) => {
            this.bot.telegram.sendMessage(ctx.message.chat.id, 
                `Имя: ${ctx.message.from.first_name}\n` +
                `id: ${ctx.message.from.id}\n` +
                `Кол-во заказов: ${Math.random()}`);
        });

        this.bot.hears("Оформить заказ", (ctx) => {
            ctx.reply('Выберите товар:', dealKeyboard());
        });

        // Добавить логику поиска
        this.bot.action('search', (ctx) => {
            ctx.editMessageText('Введите название товара: (не работает)', backKeyboard(false));
        })

        this.bot.action('back', (ctx) => {
            ctx.editMessageText('Выберите товар:', dealKeyboard());
        })

        // Добавить логику добавления заказа в БД и передачу username в отстук
        this.bot.action('order', (ctx) => {

            ctx.editMessageText("Спасибо за покупку, Ваш заказ в очереди!\nСкоро мы с Вами свяжемся!", backKeyboard(false))
            ctx.telegram.sendMessage(5084751842, `Новый заказ!`)
        })

        // handler для кнопок с товарами
        this.bot.action(/^deal_(\d+)$/, (ctx) => {
            const dealNumber = parseInt(ctx.match[1]);
        
            const messageText = `Информация о товаре №${dealNumber}`;
        
            ctx.editMessageText(messageText, backKeyboard(true));
        });

    }
}