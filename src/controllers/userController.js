const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "notesapi";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex for email validations

// User Sign Up
const userSignUp = async (req, res) => {
  const { username, email, password } = req.body;

  // Check for missing or empty fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
    });

    if (!result) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//User Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing or empty fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    res.status(200).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { userSignUp, userLogin };
