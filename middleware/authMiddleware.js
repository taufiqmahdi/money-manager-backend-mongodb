const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const config = process.env;

const protect = asyncHandler(async (req, res, next) => {
  // Get token from header
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Not authorized, no token");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    // Get user from the token
    req.user = await User.findOne({ _id: decoded.id });

    //Check if the token is the requester's
    if (req.body.email == req.user.email) {
      req.user = decoded;
      next();
    } else {
      throw new Error("Not authorized");
    }
  } catch (error) {
    return res.status(401).send("Not authorized");
  }
});

module.exports = { protect };
