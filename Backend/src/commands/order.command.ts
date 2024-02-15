
import { Command } from "./command.class";
import { dealKeyboard, backKeyboard } from "../components/keyboards";
import { OwnerService } from "../config/config.owner";
import { DataBase } from "../Database";
import { Service } from "../entities/Service";

const ownerService = new OwnerService();

export class OrderCommand extends Command {
    private db: DataBase;

    constructor(botInstance: Command['bot']) {
        super(botInstance); 
        this.db = new DataBase();
    }

    async handle(): Promise<void> {

        await this.db.connect();

        this.bot.hears("Оформить заказ", async (ctx) => {
            const services: Service[] = await this.db.fetchServices();
            ctx.reply('Выберите товар:', dealKeyboard(services));
        });


        // Добавить логику поиска
        this.bot.action('search', (ctx) => {
            ctx.editMessageText('Введите название товара: (не работает)', backKeyboard(false));
        })

        this.bot.action('back', async (ctx) => {
            const services: Service[] = await this.db.fetchServices();
            ctx.editMessageText('Выберите товар:', dealKeyboard(services));
        })

        // Добавить логику добавления заказа в БД и передачу username в отстук
        this.bot.action('order', (ctx) => {

            ctx.editMessageText("Спасибо за покупку, Ваш заказ в очереди!\nСкоро мы с Вами свяжемся!", backKeyboard(false))
            ctx.telegram.sendMessage(ownerService.get(), `Новый заказ!`)
        })
        

        // handler для кнопок с товарами
        this.bot.action(/^service_(\d+)$/, async (ctx) => {
            const serviceId = parseInt(ctx.match[1]);
            const serviceDetails: Service = await this.db.fetchServiceById(serviceId);

            const messageText = `Информация об услуге: ${serviceDetails.name}\nЦена: ${serviceDetails.price}\nОписание: ${serviceDetails.description || 'Нет описания'}`;
            ctx.editMessageText(messageText, backKeyboard(true));
        });
    }
}