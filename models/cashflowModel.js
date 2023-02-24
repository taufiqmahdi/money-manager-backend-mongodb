const mongoose = require("mongoose");

const cashflowSchema = mongoose.Schema(
  {
    detail: {
      type: String,
      required: [true, "Please add a detail"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cashflowType: {
      type: String,
      required: [true, "Please add cashflow type value"],
    },
    cashflowTypeDetail: {
      type: String,
      required: [true, "Please add cashflow type detail value"],
    },
    amount: {
      type: Number,
      required: [true, "Please add amount value"],
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    balance: {
      type: Number,
      required: [true, "Please add balance value"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cashflow", cashflowSchema);
