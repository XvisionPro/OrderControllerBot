import { Command } from "./command.class";
import { DataBase } from "../Database";

export class ProfileCommand extends Command {
    private db: DataBase;

    constructor(botInstance: Command['bot']) {
        super(botInstance); 
        this.db = new DataBase();
    }

    async handle(): Promise<void> {

        this.bot.hears("Профиль 👤", async (ctx) => {
            const userId = ctx.message.from.id;
            const userFirstName = ctx.message.from.first_name;

            try {
                
                const orderCount = await this.db.countOrdersForUser(userId);

                const profileMessage = `Имя: ${userFirstName}\n` +
                                        `id: ${userId}\n` +
                                        `Кол-во заказов: ${orderCount}`;

                this.bot.telegram.sendMessage(ctx.message.chat.id, profileMessage);
            } catch (error) {
                console.error('Ошибка получения пользователя:', error);
                this.bot.telegram.sendMessage(ctx.message.chat.id, "Произошла ошибка при получении профиля пользователя. Пожалуйста, попробуйте позже.");
            }
        });
    }
}