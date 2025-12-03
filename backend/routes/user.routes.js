const express = require("express");
const {
  registerUser,
  loginUser,
  displayUsers,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", displayUsers);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
