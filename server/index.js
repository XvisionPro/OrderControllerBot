import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import generalRoutes from "./routes/general.js";
import sequelize from "./database.js";

// data imports
import Customer from "./models/Customer.js";
import Service from "./models/Service.js";
import Order from "./models/Order.js";


/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/general", generalRoutes);
app.listen(8080);


Customer.hasMany(Order, {
  foreignKey: 'client_id'
});
Service.hasMany(Order, {
  foreignKey: 'service_id'
})

sequelize.sync();





