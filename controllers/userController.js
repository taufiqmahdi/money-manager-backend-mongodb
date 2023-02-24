const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  if (!(email && username && password && firstName && lastName)) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error("Email already taken");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    firstName,
    lastName,
    email: email.toLowerCase(), // sanitize: convert email to lowercase
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!(email && password)) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      _id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Edit user data
// @route   POST /api/users/edit
// @access  Private
const editUser = asyncHandler(async (req, res) => {
  const { email, username, firstName, lastName } = req.body;

  // Validate user input
  if (!(email) && !(username || firstName || lastName)) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check for user email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("User Not Found");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { username: username, firstName: firstName, lastName: lastName },
    { returnDocument: "after" }
  );

  return res.status(200).json({ user, updatedUser });
});

// @desc    Get user data
// @route   POST /api/users/user
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate user input
  if (!email) {
    res.status(400).send("Email required");
  }

  const { id } = req.user;

  let user = await User.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: "cashflows",
        localField: "_id",
        foreignField: "userId",
        as: "cashflow",
        pipeline: [{ $sort: { _id: -1 } }, { $limit: 1 }],
      },
    },
  ]);
  
  if (!user) {
    return res.status(401).send("User Not Found");
  }

  var balance = 0;

  if (user[0].cashflow[0]) {
    balance = user[0].cashflow[0].balance;
  }

  user = user[0]

  return res.status(200).json({
    _id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token: generateToken(user._id),
    balance: balance,
  });
});

//Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  editUser,
};
