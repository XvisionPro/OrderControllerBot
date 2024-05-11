import { DataTypes } from "sequelize"
import sequelize from "../database.js"
import Customer from "./Customer.js";


const Order = sequelize.define(
  'Заказ',
  {
    // Здесь определяются атрибуты модели
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'new'
      // allowNull по умолчанию имеет значение true
    },
  },
  {
    freezeTableName: true,
  }
)

// `sequelize.define` возвращает модель
Order.sync();
console.log(Order === sequelize.models.Order) // true


// test
// const order = await Order.create({
//   client_id: 1,
//   service_id: 1,
// })
export default Order

