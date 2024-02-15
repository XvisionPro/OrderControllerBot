import { Markup} from "telegraf";
import { Service } from "../entities/Service";

export const dealKeyboard = (services:Array<Service>) => {
    const groupedServices = [];
    for (let i =  0; i < services.length; i +=  2) {
        groupedServices.push([
            Markup.button.callback(services[i]?.name || '', `service_${services[i]?.id}`),
            Markup.button.callback(services[i +  1]?.name || '', `service_${services[i +  1]?.id}`)
        ]);
    }

    groupedServices.push([Markup.button.callback("Поиск 🔍", "search")]);

    return Markup.inlineKeyboard(groupedServices);
};

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