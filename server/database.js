import dotenv from "dotenv";
import pg from 'pg';
import { Sequelize } from "sequelize";

var sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/ordercontroller');

export default sequelize;

export function GetConnection(){
  sequelize.GetConnection;
}
