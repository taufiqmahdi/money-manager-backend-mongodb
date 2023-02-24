const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.CONNECTION_STRING + "://" + process.env.DATABASE_USERNAME + ":" + process.env.DATABASE_PASSWORD + "@" +  process.env.DATABASE_HOSTNAME + "/" + process.env.DATABASE_NAME
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
