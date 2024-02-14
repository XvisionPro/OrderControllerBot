import { Markup} from "telegraf";

export const dealKeyboard = () => {
    return (
        Markup.inlineKeyboard([
            [Markup.button.callback("Товар  1", "deal_1"), Markup.button.callback("Товар  2", "deal_2")],
            [Markup.button.callback("Товар  3", "deal_3"), Markup.button.callback("Товар  4", "deal_4")],
            [Markup.button.callback("Товар  5", "deal_5"), Markup.button.callback("Товар 6", "deal_6")],
            [Markup.button.callback("Поиск 🔍", "search")]
        ])
    )
}

export const backKeyboard = (order:boolean) => {
    if (!order){
    return (
        Markup.inlineKeyboard([
            [Markup.button.callback('Вернуться ко всем товарам', 'back')],
        ])
    )
    }
    else {
        return (
            Markup.inlineKeyboard([
                [Markup.button.callback('Оформить заказ', 'order')],
                [Markup.button.callback('Ко всем товарам', 'back')]
            ])
        )
    }
}