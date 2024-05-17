import { DataTypes } from "sequelize"
import sequelize from "../database.js"

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

Service.sync();
console.log(Service === sequelize.models.Service) // true

export default Service

