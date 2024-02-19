
import { Command } from "./command.class";
import { dealKeyboard, backKeyboard, paginationKeyboard } from "../components/keyboards";
import { OwnerService } from "../config/config.owner";
import { DataBase } from "../Database";
import { Service } from "../entities/Service";

const ownerService = new OwnerService();

interface SelectedServiceIds {
    [userId: number]: number;
}

const selectedServiceIds: SelectedServiceIds = {};
const userStates: { [key: number]: string | null } = {};

const pageSize =  3; // Количество заказов на одной странице

export class OrderCommand extends Command {
    private db: DataBase;

    constructor(botInstance: Command['bot']) {
        super(botInstance); 
        this.db = new DataBase();
    }

    async handle(): Promise<void> {


        this.bot.hears("Оформить заказ", async (ctx) => {
            const services: Service[] = await this.db.fetchServices();
            ctx.replyWithPhoto('https://i.pinimg.com/564x/da/40/4b/da404bf7bd4398c9f256c65507d3c860.jpg', {caption: 'Выберите товар:', reply_markup:{inline_keyboard: dealKeyboard(services)}});
        });

        this.bot.hears('История заказов', async (ctx) => {
            const userId = ctx.from?.id; // Получаем ID пользователя из контекста
            if (!userId) {
                ctx.reply("Не удалось получить ID пользователя.");
                return;
            }
            
            const page = 1

            try {
                // Получаем историю заказов для пользователя с пагинацией
                const { orders, totalOrders } = await this.db.showOrdersHistory(userId, page);
                // Форматируем результаты для отправки пользователю
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
                
                // Вычисляем общее количество страниц
                const totalPages = Math.ceil(totalOrders / pageSize);   
                const pagination = paginationKeyboard(page, totalPages);
                // Используем pagination для отправки сообщения с клавиатурой
                ctx.replyWithHTML(message, {reply_markup: {inline_keyboard:[pagination]}});
            } 
            catch (error) 
            {
                console.error('Ошибка при получении истории заказов:', error);
                ctx.reply("Произошла ошибка при получении истории заказов.");
            }
        });

        this.bot.action('search', (ctx) => {
            // Проверка для TypeScript
            if (!ctx.from) {
                console.error('Не получил user');
                return;
            }
            
            userStates[ctx.from.id] = 'searching';
            ctx.reply('Введите название товара:');
        });

        this.bot.on('text', async (ctx) => {
            
            if (userStates[ctx.from.id] === 'searching') {
                const searchTerm = ctx.message.text;
                try {
                    const results = await this.db.searchServicesByName(searchTerm);
                    if (results.length >  0) {
                        
                        const inlineKeyboard = results.map(result => {
                            return {
                                text: `${result.name}`,
                                callback_data: `service_${result.id}`
                            };
                        });
        
                        ctx.replyWithPhoto('https://top-fon.com/uploads/posts/2023-01/1675106599_top-fon-com-p-foto-dlya-prezentatsii-bez-fona-218.jpg', { 
                            caption: 'Найденные товары',
                            reply_markup: {
                                inline_keyboard: [inlineKeyboard]
                            }
                        },);
                    } else {
                        ctx.reply('Товары не найдены.');
                    }
                } catch (error) {
                    console.error('Ошибка при поиске товаров:', error);
                    ctx.reply('Произошла ошибка при поиске товаров.');
                }

                userStates[ctx.from.id] = null;
            }
        });
        
        // Возвращение на просмотр
        this.bot.action('back', async (ctx) => {
            const services: Service[] = await this.db.fetchServices();
            await ctx.editMessageMedia({media: 'https://i.pinimg.com/564x/da/40/4b/da404bf7bd4398c9f256c65507d3c860.jpg', type: "photo"});
            await ctx.editMessageCaption('Выберите товар:', {reply_markup:{inline_keyboard: dealKeyboard(services)}});
        })
        
        // Оформление заказа
        this.bot.action('order', async (ctx) => {
            // Проверка для TypeScript
            if (!ctx.from) {
                console.error('Не получил user');
                return;
            }

            // Получение нужных ID
            const serviceId = selectedServiceIds[ctx.from.id];
            const clientId = ctx.from?.id;

            if (!serviceId || !clientId) {
                ctx.reply("Не удалось обработать заказ. Пожалуйста, повторите попытку позже.");
                return;
            }

            try {
                // Создание нового заказа
                const orderId = await this.db.createNewOrder(clientId, serviceId);

                // Получение инфы об услуге
                const service = await this.db.fetchServiceById(serviceId);
                const username = ctx.from?.username;

                // Сообщение исполнителю
                const messageToOwner = `<b>Новый заказ!</b>\n\nНомер заказа: ${orderId}\nУслуга: ${service.name}\nПользователь: @${username}`;
                ctx.telegram.sendMessage(ownerService.get(), messageToOwner, {parse_mode: 'HTML'});

                // Сообщение заказчику
                ctx.editMessageCaption("Спасибо за покупку, Ваш заказ в очереди!\nСкоро мы с Вами свяжемся!", backKeyboard(false));

            } catch (error) {
                console.error('Не получилось создать заказ:', error);
                ctx.reply("Не удалось обработать заказ. Пожалуйста, повторите попытку позже.");
            }
        });


        // handler для кнопок с товарами
        this.bot.action(/^service_(\d+)$/, async (ctx) => {
            // Проверка для TypeScript
            if (!ctx.from) {
                console.error('Не получил user');
                return;
            }

            const serviceId = parseInt(ctx.match[1]);
            const serviceDetails: Service = await this.db.fetchServiceById(serviceId);

            selectedServiceIds[ctx.from.id] = serviceId;

            const messageText = `Услуга: ${serviceDetails.name}\n\nЦена: ${serviceDetails.price}\n\nОписание: ${serviceDetails.description || 'Нет описания'}`;
            
            const imageUrl = serviceDetails.image_path;
            if (imageUrl) {
                await ctx.editMessageMedia({media: imageUrl, type: "photo"});
                await ctx.editMessageCaption(messageText, backKeyboard(true));
            } 
            else {
                await ctx.editMessageCaption(messageText, backKeyboard(true));
                // console.error('Нет URL изображения для услуги');
            }
            

        });

    }
}