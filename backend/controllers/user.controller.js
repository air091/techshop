require("dotenv/config");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { SignJWT } = require("jose");

const registerUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(400).json({ message: "All fields are required." });
    if (password.length < 4)
      return response
        .status(400)
        .json({ message: "Password must at least 4 characters long." });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashPassword });
    await user.save();
    response.status(201).json({ message: "Register successfully.", user });
  } catch (error) {
    console.error(`POST (register) /api/user ${error}`);
    response.status(500).json({ message: error });
  }
};

const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email });
    if (!user) return response.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return response
        .status(401)
        .json({ message: "Email or password is incorrect." });

    const token = await new SignJWT({ email: user.email, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    response.status(200).json({ message: "Login successfully.", user, token });
  } catch (error) {
    console.error(`POST (login) /api/user ${error}`);
    response.status(500).json({ message: error });
  }
};

const displayUsers = async (request, response) => {
  try {
    const user = await User.find({});
    if (!user.length)
      return response.status(404).json({ message: "User not found." });
    response.status(200).json({ message: "Users fetched successfully.", user });
  } catch (error) {
    console.error(`GET /api/user ${error}`);
    response.status(500).json({ message: error });
  }
};

const updateUser = async (request, response) => {
  try {
    const { id } = request.params;
    const { email, password, role } = request.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return response.status(400).json({ message: "Invalid id." });

    const field = {};
    if (email) field.email = email;
    if (password) {
      if (password.length < 4)
        return response
          .status(400)
          .json({ message: "Password must at least 4 characters long." });
      field.password = password;
    }
    if (role) {
      console.log(role);
      if (role !== "user" && role !== "admin")
        return response.status(400).json({ message: "Invalid role." });
      field.role = role;
    }
    if (!Object.values(field).length)
      return response.status(400).json({ message: "No field to update." });

    const user = await User.findByIdAndUpdate(id, field, {
      new: true,
      runValidators: true,
    });
    if (!user) return response.status(404).json({ message: "User not found." });
    response.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error(`PUT /api/user/:id ${error}`);
    response.status(500).json({ message: error });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return response.status(400).json({ message: "Invalid id." });

    const user = await User.findByIdAndDelete(id);
    if (!user) return response.status(404).json({ message: "User not found." });
    response.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(`DELETE /api/user/:id ${error}`);
    response.status(500).json({ message: error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  displayUsers,
  updateUser,
  deleteUser,
};
