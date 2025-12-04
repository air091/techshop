require("dotenv/config");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { SignJWT } = require("jose");

const registerUser = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = new User({ email, password });
    await user.save();

    const userObj = { ...user.toObject() };
    delete userObj.password;
    const token = await SignJWT(userObj)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    response.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAg: 10 * 60 * 1000,
    });

    response
      .status(201)
      .json({ message: "Register successfully.", user: userObj, token });
  } catch (error) {
    console.error(`POST /api/user/register ${error}`);
    next(error);
  }
};

const loginUser = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email });
    if (!user) return response.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return response
        .status(400)
        .json({ message: "Email or password is invalid." });

    const userObj = { ...user.toObject() };
    delete userObj.password;
    const token = await new SignJWT(userObj)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    response.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    response
      .status(200)
      .json({ message: "Login successfully.", user: userObj, token });
  } catch (error) {
    console.error(`POST /api/user/login ${error}`);
    next(error);
  }
};

const displayUsers = async (request, response, next) => {
  try {
    const user = await User.find({});
    if (!user.length)
      return response.status(404).json({ message: "User not found." });
    response.status(200).json({ message: "Users fetched successfully.", user });
  } catch (error) {
    console.error(`GET /api/user ${error}`);
    next(error);
  }
};

const updateUser = async (request, response, next) => {
  try {
    const { id } = request.params;
    const { email, password, role } = request.body;

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
    next(error);
  }
};

const deleteUser = async (request, response, next) => {
  try {
    const { id } = request.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return response.status(404).json({ message: "User not found." });
    response.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(`DELETE /api/user/:id ${error}`);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  displayUsers,
  updateUser,
  deleteUser,
};
