import { DataTypes } from "sequelize"
import sequelize from "../database.js"

const Customer = sequelize.define(
  'Заказчик',
  {
    // Здесь определяются атрибуты модели
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    telegram_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
      // allowNull по умолчанию имеет значение true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      // allowNull по умолчанию имеет значение true
    },
    username:{
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
)

Customer.sync();
console.log(Customer === sequelize.models.Customer) // true

export default Customer
