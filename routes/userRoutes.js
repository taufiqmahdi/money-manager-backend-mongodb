const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  editUser,
  getUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.put("/edit", protect, editUser);
router.post("/user", protect, getUser);

module.exports = router;
