import { Command } from "./command.class";
import { paginationKeyboard } from "../components/keyboards";
import { DataBase } from "../Database";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { Markup} from "telegraf";

const pageSize =  3; // Количество заказов на одной странице

export class historyOrdersCommand extends Command {
    private db: DataBase;
    constructor(botInstance: Command['bot']) {
        super(botInstance); 
        this.db = new DataBase();
    }

    async handle(): Promise<void> {
        // console.log('1');
        
        this.bot.action(/^orders_(\d+)$/, async (ctx) => {
            // Проверка для TypeScript
            if (!ctx.from) {
                console.error('Не получил user');
                return;
            }
            const userId = ctx.from.id;
            const page = parseInt(ctx.match[1],  10);

            try {

                // Получаем заказы
                const { orders, totalOrders } = await this.db.showOrdersHistory(userId, page);
    
                const totalPages = Math.ceil(totalOrders / pageSize);
    
                let message = "<b>История заказов:</b>\n";
                orders.forEach((order, index) => {
                    message += `\n<b>Заказ ${totalOrders - order.id + 1}:</b>\n`;
                    message += `Услуга: ${order.service_id}\n`;
                    const orderDate = new Date(order.order_date);
                    const formattedDate = orderDate.toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    message += `Дата заказа: ${formattedDate}\n`;
                });
    
                const pagination = paginationKeyboard(page, totalPages);

                ctx.editMessageText(message, {reply_markup: {inline_keyboard:[pagination]}, parse_mode: 'HTML'});
            } catch (error) {
                console.error('Ошибка при обработке запроса пагинации:', error);
                ctx.answerCbQuery('Произошла ошибка при обработке запроса пагинации.');
            }
        });
    }
}