import { Command } from "./command.class";
import { paginationKeyboard } from "../components/keyboards";
import { DataBase } from "../Database";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { Markup } from "telegraf";

const pageSize = 3; // Количество заказов на одной странице

export class historyOrdersCommand extends Command {
    private db: DataBase;

    constructor(botInstance: Command['bot']) {
        super(botInstance);
        this.db = new DataBase();
    }

    async handle(): Promise<void> {
        this.bot.action(/^orders_(\d+)$/, async (ctx) => {
            if (!ctx.from) {
                console.error('Не получил user');
                return;
            }
            const userId = ctx.from.id;
            const page = parseInt(ctx.match[1], 10);

            try {
                const { orders, totalOrders } = await this.db.showOrdersHistory(userId, page);
                const totalPages = Math.ceil(totalOrders / pageSize);

                // Создаем массив промисов для получения названий услуг
                const serviceNamesPromises = orders.map(async (order) => {
                    const serviceName = await this.db.getNameOfService(order.service_id);
                    return `Услуга: ${serviceName}\n`;
                });

                // Ожидаем завершения всех промисов и формируем итоговое сообщение
                Promise.all(serviceNamesPromises).then((serviceNamesResults) => {
                    let message = "<b>История заказов:</b>\n";
                    serviceNamesResults.forEach((result, index) => {
                        message += `\n<b>Заказ ${totalOrders - orders[index].id + 1}:</b>\n`;
                        message += result;
                        const orderDate = new Date(orders[index].order_date);
                        const formattedDate = orderDate.toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        message += `Дата заказа: ${formattedDate}\n`;
                    });

                    // Создаем кнопки пагинации
                    const pagination = paginationKeyboard(page, totalPages);

                    // Отправляем итоговое сообщение с пагинацией
                    ctx.editMessageText(message, { reply_markup: { inline_keyboard: [pagination] }, parse_mode: 'HTML' });
                }).catch(error => {
                    console.error('Ошибка при формировании истории заказов:', error);
                    ctx.answerCbQuery('Произошла ошибка при обработке запроса пагинации.');
                });
            } catch (error) {
                console.error('Ошибка при обработке запроса пагинации:', error);
                ctx.answerCbQuery('Произошла ошибка при обработке запроса пагинации.');
            }
        });
    }
}
