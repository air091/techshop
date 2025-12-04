const express = require("express");
const {
  registerUser,
  loginUser,
  displayUsers,
  deleteUser,
  updateUser,
  meUser,
} = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get("/me", authenticate, meUser);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", displayUsers);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
