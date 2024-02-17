
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
            ctx.reply('Выберите товар:', dealKeyboard(services));
        });
        
        // Добавить логику поиска
        // this.bot.action('search', (ctx) => {
        //     ctx.editMessageText('Введите название товара: (не работает)', backKeyboard(false));
        // })

        // Initialize an object to store the state of each user

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
        
                        ctx.reply('Найденные товары:', {
                            reply_markup: {
                                inline_keyboard: [inlineKeyboard]
                            }
                        });
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
            ctx.editMessageText('Выберите товар:', dealKeyboard(services));
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
                ctx.editMessageText("Спасибо за покупку, Ваш заказ в очереди!\nСкоро мы с Вами свяжемся!", backKeyboard(false));

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

            const messageText = `Информация об услуге: ${serviceDetails.name}\nЦена: ${serviceDetails.price}\nОписание: ${serviceDetails.description || 'Нет описания'}`;
            ctx.editMessageText(messageText, backKeyboard(true));

        });

    }
}