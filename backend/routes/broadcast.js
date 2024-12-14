const express = require("express");
const Broadcast = require("../models/Broadcast");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { fetchUser } = require("../middlewares/fetchuser");
const router = express.Router();

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

router.delete('/deletenote/:id',fetchUser,async(req,res)=>{
  const note=await Broadcast.findById(req.params.id)
  if(!note){return res.status(404).send("Note not found")};
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Access Denied");
  }
  const deleteUser=await Broadcast.findByIdAndDelete(req.params.id);
  return res.send("Deleted record");
})

router.get('/role', fetchUser ,async(req,res)=>{
  // console.log(req.user)
  const id=req.user.id;
  console.log(id);
  const user=await User.findById(id);
  const email=user.email;
  if(user.email===process.env.ADMIN_EMAIL){
    return res.status(200).json({role: "admin"});
  }
  return res.status(200).json({role: "user"})
})

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
