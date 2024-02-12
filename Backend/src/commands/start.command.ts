import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

/* TODO:
1. Убрать повторение кода, т.е. написать общий handler для всех товаров
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
            ctx.reply('Оформление заказа');
            ctx.reply('Выберите товар:', Markup.inlineKeyboard([
                [Markup.button.callback("Товар  1", "deal_1"), Markup.button.callback("Товар  2", "deal_2")],
                [Markup.button.callback("Товар  3", "deal_3"), Markup.button.callback("Товар  4", "deal_4")],
                [Markup.button.callback("Товар  5", "deal_5"), Markup.button.callback("Товар 6", "deal_6")],
                [Markup.button.callback("Поиск 🔍", "search")]
            ]));
        });


        // Добавить логику поиска
        this.bot.action('search', (ctx) => {
            ctx.editMessageText('Введите название товара: (не работает)', Markup.inlineKeyboard([
                [Markup.button.callback('Ко всем товарам', 'back')],
            ]));
        })

        // Клаву тоже надо где-то записать а то дублируется пиздец
        this.bot.action('back', (ctx) => {
            ctx.editMessageText('Выберите товар:', Markup.inlineKeyboard([
                [Markup.button.callback("Товар  1", "deal_1"), Markup.button.callback("Товар  2", "deal_2")],
                [Markup.button.callback("Товар  3", "deal_3"), Markup.button.callback("Товар  4", "deal_4")],
                [Markup.button.callback("Товар  5", "deal_5"), Markup.button.callback("Товар 6", "deal_6")],
                [Markup.button.callback("Поиск 🔍", "search")]
            ]));
        })

        // Добавить логику добавления заказа в БД и передачу username в отстук
        this.bot.action('order', (ctx) => {
            ctx.editMessageText("Спасибо за покупку, Ваш заказ в очереди!\nСкоро мы с Вами свяжемся!", Markup.inlineKeyboard([
                [Markup.button.callback('Вернуться ко всем товарам', 'back')],
            ]))
            ctx.telegram.sendMessage(5084751842, `Новый заказ!`)
        })

        // Вот для этого handler надо написать
        this.bot.action('deal_1', (ctx) => {
            ctx.editMessageText('Информация о товаре №1', Markup.inlineKeyboard([
                [Markup.button.callback('Оформить заказ', 'order',)],
                [Markup.button.callback('Ко всем товарам', 'back')],
                
            ]))
        })
        this.bot.action('deal_2', (ctx) => {
            ctx.editMessageText('Информация о товаре №2', Markup.inlineKeyboard([
                [Markup.button.callback('Оформить заказ', 'order')],
                [Markup.button.callback('Ко всем товарам', 'back')],
            ]))
        })

        this.bot.action('deal_3', (ctx) => {
            ctx.editMessageText('Информация о товаре №3', Markup.inlineKeyboard([
                [Markup.button.callback('Оформить заказ', 'order')],
                [Markup.button.callback('Ко всем товарам', 'back')],
            ]))
        })
        this.bot.action('deal_4', (ctx) => {
            ctx.editMessageText('Информация о товаре №5', Markup.inlineKeyboard([
                [Markup.button.callback('Оформить заказ', 'order')],
                [Markup.button.callback('Ко всем товарам', 'back')],
            ]))
        })

        this.bot.action('deal_5', (ctx) => {
            ctx.editMessageText('Информация о товаре №6', Markup.inlineKeyboard([
                [Markup.button.callback('Оформить заказ', 'order')],
                [Markup.button.callback('Ко всем товарам', 'back')],
            ]))
        })
        this.bot.action('deal_6', (ctx) => {
            ctx.editMessageText('Информация о товаре №6', Markup.inlineKeyboard([
                [Markup.button.callback('Оформить заказ', 'order')],
                [Markup.button.callback('Ко всем товарам', 'back')],
            ]))
        })

    }
}