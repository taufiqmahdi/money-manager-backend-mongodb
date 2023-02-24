const asyncHandler = require("express-async-handler");

const Cashflow = require("../models/cashflowModel");
const User = require("../models/userModel");

// @desc    Get cashflows
// @route   GET /api/cashflows
// @access  Private
const getCashflows = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("User Not Found");
  }

  const { id } = user;

  const cashflows = await Cashflow.find({ userId: id });

  res.status(200).json(cashflows);
});

// @desc    Set cashflow
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
      order: [["createdAt", "DESC"]],
    });

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

// @desc    Get cashflow
// @route   GET /api/cashflows/cashflow
// @access  Private
const getCashflow = asyncHandler(async (req, res) => {
  const { email, startDate, endDate } = req.body;
  const { id } = req.user;

  const user = await User.find({ _id: id });

  if (!user) {
    return res.status(401).send("User Not Found");
  }

  const cashflow = await Cashflow.find({
    userId: req.user.id,
    date: { $gte: startDate, $lte: endDate },
  });

  return res.status(200).json(cashflow);
});

module.exports = {
  getCashflows,
  setCashflow,
  getCashflow,
};
