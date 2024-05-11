import dotenv from "dotenv";
import pg from 'pg';
import { Sequelize } from "sequelize";

var sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/ordercontroller');

try {
  await sequelize.authenticate()
  console.log('Соединение с БД было успешно установлено')
} catch (e) {
  console.log('Невозможно выполнить подключение к БД: ', e)
}

export default sequelize;

export function GetConnection(){
  sequelize.GetConnection;
}
