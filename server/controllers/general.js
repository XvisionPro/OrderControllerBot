import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Service from "../models/Service.js";

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
// export const getDashboardStats = async (req, res) => {
//   try {
//     // hardcoded values
//     const currentMonth = "November";
//     const currentYear = 2021;
//     const currentDay = "2021-11-15";

//     /* Recent Transactions */
//     const transactions = await Transaction.find()
//       .limit(50)
//       .sort({ createdOn: -1 });

//     /* Overall Stats */
//     const overallStat = await OverallStat.find({ year: currentYear });

//     const {
//       totalCustomers,
//       yearlyTotalSoldUnits,
//       yearlySalesTotal,
//       monthlyData,
//       salesByCategory,
//     } = overallStat[0];

//     const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
//       return month === currentMonth;
//     });

//     const todayStats = overallStat[0].dailyData.find(({ date }) => {
//       return date === currentDay;
//     });

//     res.status(200).json({
//       totalCustomers,
//       yearlyTotalSoldUnits,
//       yearlySalesTotal,
//       monthlyData,
//       salesByCategory,
//       thisMonthStats,
//       todayStats,
//       transactions,
//     });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };
