import { DataTypes } from "sequelize"
import sequelize from "../database.js"
import Order from "./Order.js";


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

// `sequelize.define` возвращает модель
Customer.sync();
// const customer = await Customer.create({
//   telegram_id:  1,
//   username: '4len',
// })
console.log(Customer === sequelize.models.Customer) // true


//test
// const john = await Customer.create({
//   telegram_id: 133425346346,
//   first_name: 'John',
//   last_name: 'Smith',
//   username: 'JohnSmith',
// })
export default Customer

//   telegramId:{
//     schema: 'telegram_id BIGINT NOT NULL'
//   },
//   firstName:{
//     schema: 'first_name VARCHAR(50) NOT NULL',
//     validations: [
//       function (input, colName) {
//         if (input.length > 50) throw new Error(colName + ' must be less than 50 char')
//       },
//     ]
//   },
//   lastName:{
//     schema: 'last_name VARCHAR NOT NULL',
//     validations: [
//       function (input, colName) {
//         if (input.length > 50) throw new Error(colName + ' must be less than 50 char')
//       },
//     ]
//   },
//   username:{
//     schema: 'username VARCHAR NOT NULL',
//     validations: [
//       function (input, colName) {
//         if (input.length > 32) throw new Error(colName + ' must be less than 50 char')
//       },
//     ]
//   },
// });

// export default Customer;




// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       min: 2,
//       max: 100,
//     },
//     email: {
//       type: String,
//       required: true,
//       max: 50,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       min: 5,
//     },
//     city: String,
//     state: String,
//     country: String,
//     occupation: String,
//     phoneNumber: String,
//     transactions: Array,
//     role: {
//       type: String,
//       enum: ["user", "admin", "superadmin"],
//       default: "admin",
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", UserSchema);
// export default User;
