const express = require("express");
const Broadcast = require("../models/Broadcast");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { fetchUser } = require("../middlewares/fetchuser");
const router = express.Router();
const mongoose=require('mongoose')

router.post(
  "/add",
  fetchUser, // Middleware to verify the user
  body("text").isLength({ min: 5 }).withMessage("Broadcast text must be at least 5 characters long."),
  async (req, res) => {
    let success = false;

    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg).join(", ");
        console.error(`[BROADCAST VALIDATION ERROR]: ${errorMessages}`);
        return res.status(400).json({ success, msg: errorMessages });
      }

      const { text } = req.body;

      // Create broadcast
      const broadcast = await Broadcast.create({
        text: text,
        user: req.user.id, // Assuming `fetchUser` middleware adds `user` to `req`
      });

      if (!broadcast) {
        console.error("[BROADCAST CREATION ERROR]: Unable to create broadcast.");
        return res.status(400).json({ success, msg: "Unable to create broadcast." });
      }

      success = true;
      console.log(`[BROADCAST SUCCESS]: Broadcast created by user ID ${req.user.id}`);
      return res.status(200).json({ success, msg: "Broadcast has been added successfully", broadcast });
    } catch (err) {
      console.error(`[BROADCAST SERVER ERROR]: ${err.message}`);
      return res.status(500).json({ success, msg: "Internal Server Error" });
    }
  }
);

router.delete('/delete/:id',fetchUser,async(req,res)=>{
  const broadcast=await Broadcast.findById(req.params.id)
  if(!broadcast){return res.status(404).send("Broadcast not found")};
  if(broadcast.user.toString()!==req.user.id){
    return res.status(401).send("Access Denied");
  }
  const deleteUser=await Broadcast.findByIdAndDelete(req.params.id);
  return res.status(200).json({success: true});
})

router.get('/role', fetchUser, async (req, res) => {
  try {
    const id = req.user.id;
    console.log('User ID:', id);

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      console.log('User not found for ID:', id);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is an admin
    if (user.email === process.env.ADMIN_EMAIL) {
      console.log('Admin access granted for:', user.email);
      return res.status(200).json({ role: 'admin' });
    }

    console.log('User role granted for:', user.email);
    return res.status(200).json({ role: 'user' });
  } catch (error) {
    console.error('Error in /role route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/render', fetchUser, async (req, res) => {
  try {
    // Fetch all broadcasts
    const broadcasts = await Broadcast.find() // Populate the user field with the user's email

    if (!broadcasts) {
      return res.status(404).json({ success: false, msg: "No broadcasts found" });
    }

    return res.status(200).json({ success: true, broadcasts });
  } catch (err) {
    console.error(`[BROADCAST SERVER ERROR]: ${err.message}`);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

module.exports = router;
