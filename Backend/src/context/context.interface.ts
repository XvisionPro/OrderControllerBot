import { Context } from "telegraf";

export interface SessionData {
    fapping: boolean;

}

export interface IBotContext extends Context {
    session: SessionData;
}