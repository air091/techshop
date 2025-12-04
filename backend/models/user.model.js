const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email.",
      },
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      minlength: [4, "Password must at least 4 characters long."],
      required: [true, "Password is required."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: [true, "Role is required."],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("users", UserSchema);
module.exports = User;
