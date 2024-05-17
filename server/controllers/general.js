import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Service from "../models/Service.js";
import {Op} from 'sequelize';

export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findAll({
      where: {
        id: id,
      }
    });
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findAll({
      where: {
        id: id,
      }
    });
    res.status(200).json(service);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findAll({
      where: {
        id: id,
      }
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllService = async (req, res) => {
  try {
    const order = await Service.findAll();
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const order = await Customer.findAll();
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const order = await Order.findAll();
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async(req, res) => {
  try {
    const orders = await Order.findAll();
    const orderCount =orders.length;
    const serviceCount = (await Service.findAll()).length;
    const customerCount = (await Customer.findAll()).length;

    const START = new Date();
    START.setHours(0, 0, 0, 0);
    const NOW = new Date();
    const ordersToday = await Order.findAll({
      where: {
        order_date: {
          [Op.between]: [START.toISOString(), NOW.toISOString()]
      }
    }
    });
    const countToday = ordersToday.length;

    res.status(200).json({
      orderCount,
      serviceCount,
      customerCount,
      ordersToday,
      countToday,
    });
    
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const updateOrder = async(req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    await order.update({ status: "completed" });
    res.status(200).json({message: 'Заменено.'});
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const deleteOrder = async(req, res) => {
  try {
    const { id } = req.params;
    await Order.destroy({
      where: { id: id }
    })
    res.status(200).json({message: `ID ${id} удалён.`});
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}
