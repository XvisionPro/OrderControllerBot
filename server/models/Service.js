import { DataTypes } from "sequelize"
import sequelize from "../database.js"
import Order from "./Order.js";


const Service = sequelize.define(
  'Услуга',
  {
    // Здесь определяются атрибуты модели
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      // allowNull по умолчанию имеет значение true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      // allowNull по умолчанию имеет значение true
    },
    image_path:{
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
)

// `sequelize.define` возвращает модель
Service.sync();
Service.hasMany(Order, {
  foreignKey: 'service_id'
})
console.log(Service === sequelize.models.Service) // true


// test
// const minet = await Service.create({
//   name: 'Минет',
//   description: 'Глубокий',
//   price: 2000.00,
//   image_path: '/uploads/minet.svg',
// })
export default Service

