import { DataTypes } from "sequelize"
import sequelize from "../database.js"

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

Order.sync();

export default Order

