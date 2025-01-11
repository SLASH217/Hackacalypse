const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const router = express.Router();

router.post(
  "/signup",
  [
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("email").isEmail().withMessage("Invalid email format."),
  ],
  async (req, res) => {
    let success = false;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
          const errorMessages = errors.array().map(err => err.msg); // Extract only the messages
          return res.status(400).json({ success, error: errorMessages.join(", ") }); // Join messages into a single string
    }

    const { username, email, password } = req.body;

    try {
      // Check if user with the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success,
          error: "An account with this email already exists.",
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      // Generate JWT token
      const payload = { id: user.id };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token expiration time
      });

      success = true;
      return res.status(201).json({ success, token: authToken, role: "user" });
    } catch (err) {
      console.error({error: err.message});
      return res.status(500).json({
        success,
        error: "Internal Server Error",
      });
    }
  }
);


router.post(
    "/login",
    [
      body("email").isEmail().withMessage("Invalid email format."),
      body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    ],
    async (req, res) => {
      let success = false;
  
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(", ");
        return res.status(400).json({ success, error: errorMessages });
      }
      const { email, password } = req.body;
      let role="user"
      try {
        // Check if user exists
        const user = await User.findOne({ email });
        if(email===process.env.ADMIN_EMAIL){role="admin"};
        if (!user) {
          return res.status(400).json({ success, error: "Invalid email or password." });
        }
  
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ success, error: "Invalid email or password." });
        }
  
        // Generate JWT
        success = true;
        const payload = { id: user.id };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  
        // Send response with token
        return res.status(200).json({ success, token: authToken,role });
      } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, error: "Internal Server Error" });
      }
    }
  );

module.exports = router;
