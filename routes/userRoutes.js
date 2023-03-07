const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  editUser,
  getUser,
  editUserPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.put("/edit", protect, editUser);
router.put("/edit-pass", protect, editUserPassword);
router.post("/user", protect, getUser);

module.exports = router;
