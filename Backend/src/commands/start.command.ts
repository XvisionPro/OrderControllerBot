import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }
    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session);
            ctx.reply("Ты Дрочишь?!", Markup.inlineKeyboard([
                Markup.button.callback("Да", "fap_yes"),
                Markup.button.callback("Нет", "fap_no"),
            ]));
        });

        this.bot.action("fap_yes", (ctx)=> {
            ctx.session.fapping = true;
            ctx.editMessageText("Я так и знал!");
        })

        this.bot.action("fap_no", (ctx)=> {
            ctx.session.fapping = false;
            ctx.editMessageText("Все так говорят...");
        })
    }
}