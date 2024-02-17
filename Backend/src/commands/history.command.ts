import { Command } from "./command.class";
import { paginationKeyboard } from "../components/keyboards";
import { DataBase } from "../Database";

const pageSize =  3; // Количество заказов на одной странице

export class historyOrdersCommand extends Command {
    private db: DataBase;
    constructor(botInstance: Command['bot']) {
        super(botInstance); 
        this.db = new DataBase();
    }

    async handle(): Promise<void> {
        console.log('1');
        
        this.bot.hears('История заказов', async (ctx) => {
            console.log('2');
            const userId = ctx.from?.id; // Получаем ID пользователя из контекста
            if (!userId) {
                ctx.reply("Не удалось получить ID пользователя.");
                return;
            }
            
            const page = 1

            try {
                console.log('Хуй');
                // Получаем историю заказов для пользователя с пагинацией
                const { orders, totalOrders } = await this.db.showOrdersHistory(userId, page);
                // Форматируем результаты для отправки пользователю
                let message = "<b>История заказов:</b>\n";
                orders.forEach((order, index) => {
                    message += `\n<b>Заказ ${index +   1}:</b>\n`;
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
                
                // Вычисляем общее количество страниц
                const totalPages = Math.ceil(totalOrders / pageSize);   

                // Используем pagination для отправки сообщения с клавиатурой
                ctx.replyWithHTML(message, paginationKeyboard(page, totalPages));
            } 
            catch (error) 
            {
                console.error('Ошибка при получении истории заказов:', error);
                ctx.reply("Произошла ошибка при получении истории заказов.");
            }
        });
        
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
    
                let message = "История заказов:\n";
                orders.forEach((order, index) => {
                    message += `\nЗаказ ${index +   1}:\n`;
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
    
                ctx.editMessageText(message, pagination);
            } catch (error) {
                console.error('Ошибка при обработке запроса пагинации:', error);
                ctx.answerCbQuery('Произошла ошибка при обработке запроса пагинации.');
            }
        });
    }
}