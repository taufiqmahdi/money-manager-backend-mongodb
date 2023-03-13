const asyncHandler = require("express-async-handler");

const Cashflow = require("../models/cashflowModel");
const User = require("../models/userModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// @desc    Get all cashflows
// @route   POST /api/cashflows
// @access  Private
const getCashflows = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("User Not Found");
  }

  const { id } = user;

  const cashflows = await Cashflow.find({ userId: id }, {userId: 0, createdAt: 0, updatedAt: 0, __v: 0})

  res.status(200).json(cashflows);
});

// @desc    Set cashflow / Add a cashflow
// @route   POST /api/cashflows/set
// @access  Private
const setCashflow = asyncHandler(async (req, res) => {
  const {
    email,
    detail,
    cashflowType,
    cashflowTypeDetail,
    amount,
    description,
    date,
  } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("User Not Found");
  }

  const { id } = user;

  const getBalance = async () => {
    const latestEntry = await Cashflow.findOne({
      where: { userId: id },
    }).sort({ createdAt: -1 });

    var balance = 0;

    if (latestEntry) {
      balance = latestEntry.balance;
      balance = Number(balance);
    }

    if (cashflowType === "Income") {
      return balance + Number(amount);
    }

    return balance - Number(amount);
  };

  const newBalance = await getBalance();

  const cashflow = await Cashflow.create({
    detail: detail,
    userId: id,
    cashflowType: cashflowType,
    cashflowTypeDetail: cashflowTypeDetail,
    amount: amount,
    description: description,
    date: date,
    balance: newBalance,
  });

  res.status(200).json(cashflow);
});

// @desc    Get cashflow of a spesific date
// @route   POST /api/cashflows/cashflow
// @access  Private
const getCashflow = asyncHandler(async (req, res) => {
  const { email, startDate, endDate } = req.body;
  const { id } = req.user;

  const user = await User.find({ _id: id });

  if (!user) {
    return res.status(401).send("User Not Found");
  }

  const cashflow = await Cashflow.aggregate([
    {
      $match: {
        userId: new ObjectId(id),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $project: {
        detail: 1,
        userId: 1,
        cashflowType: 1,
        cashflowTypeDetail: 1,
        amount: 1,
        balance: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        date: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$date",
          },
        },
      },
    },
  ]);

  return res.status(200).json(cashflow);
});

const getCashflowByPage = asyncHandler(async (req, res) => {
  const { email, startDate, endDate, page } = req.body;
  const { id } = req.user;

  const user = await User.find({ _id: id });

  if (!user) {
    return res.status(401).send("User Not Found");
  }

  let skipValue;

  page == 1 ? (skipValue = 1) : (skipValue = (page - 1) * 10);

  const cashflow = await Cashflow.aggregate([
    {
      $match: {
        userId: new ObjectId(id),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $project: {
        detail: 1,
        userId: 1,
        cashflowType: 1,
        cashflowTypeDetail: 1,
        amount: 1,
        balance: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        date: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$date",
          },
        },
      },
    },
    {
      $skip: skipValue,
    },
    {
      $limit: 10,
    },
  ]);

  return res.status(200).json(cashflow);
});

module.exports = {
  getCashflows,
  setCashflow,
  getCashflow,
  getCashflowByPage,
};
