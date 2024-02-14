import { Command } from "./command.class";

export class ProfileCommand extends Command {
    handle(): void {
        // Если я правильно помню у нас в БД данные будут о пользователях, оттуда надо подтягивать
        this.bot.hears("Профиль 👤", (ctx) => {
            this.bot.telegram.sendMessage(ctx.message.chat.id, 
                `Имя: ${ctx.message.from.first_name}\n` +
                `id: ${ctx.message.from.id}\n` +
                `Кол-во заказов: ${Math.random()}`);
        });
    }
}