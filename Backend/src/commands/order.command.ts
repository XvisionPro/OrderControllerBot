
import { Command } from "./command.class";
import { dealKeyboard, backKeyboard } from "../components/keyboards";

export class OrderCommand extends Command {
    handle(): void {
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