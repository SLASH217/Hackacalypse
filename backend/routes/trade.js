const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const { fetchUser } = require('../middlewares/fetchuser');
 // Assuming this middleware adds user to request
const router = express.Router();

const { body, validationResult } = require('express-validator');
const Trade = require('../models/Trade');

router.post(
    '/offer-item',
    fetchUser,
    [
      body('name').notEmpty().withMessage('Item name is required.'),
      body('description').notEmpty().withMessage('Item description is required.'),
      body('requestedItem').optional().isString().withMessage('Invalid input for requested item.'), // Validate as plain text
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors.',
          errors: errors.array(),
        });
      }
  
      const { name, description, requestedItem } = req.body;
  
      try {
        // Create and save the new offered item
        const item = new Item({
          name,
          description,
          offeredBy: req.user.id,
          requestedItem, // Save plain text
        });
  
        await item.save();
  
        // Update the user's itemsForTrade list
        await User.findByIdAndUpdate(req.user.id, {
          $push: { itemsForTrade: item._id },
        });
  
        return res.status(201).json({
          success: true,
          message: 'Item successfully offered for trade.',
          item,
        });
      } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    }
  );
  


  router.get('/items', async (req, res) => {
    try {
      const items = await Item.find()
  
      return res.status(200).json({
        success: true,
        items,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

router.post('/initiate-trade', fetchUser, async (req, res) => {
    const { itemId, offeredId } = req.body;
  
    try {
      // Fetch the item and the user who is offering it
      const item = await Item.findById(itemId);
      const userOfferingItem = await User.findById(item.offeredBy);
  
      // Check if the item exists and is available
      if (!item || !item.isAvailable) {
        return res.status(400).json({ success: false, message: 'Item is no longer available.' });
      }
  
      // Check if the trade target user exists
      const tradeWithUser = await User.findById(offeredId);
      if (!tradeWithUser) {
        return res.status(400).json({ success: false, message: 'User does not exist.' });
      }
  
      // Send a trade offer (this could be an email or in-app notification)
      // For simplicity, we are just notifying here
      return res.status(200).json({
        success: true,
        message: `Trade offer sent to ${tradeWithUser.username}`,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

router.post('/accept-reject-trade', fetchUser, async (req, res) => {
    const { tradeOfferId, decision } = req.body; // Decision can be 'accept' or 'reject'
  
    try {
      // Handle the trade acceptance logic
      if (decision === 'accept') {
        // Mark both users' items as traded
        // Example: update `isAvailable` status and adjust the items they own
        return res.status(200).json({ success: true, message: 'Trade accepted!' });
      } else {
        return res.status(200).json({ success: true, message: 'Trade rejected.' });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  router.post('/accept-trade/:tradeId', fetchUser, async (req, res) => {
    try {
      const { tradeId } = req.params;
  
      // Find the trade request
      const trade = await Trade.findById(tradeId).populate('requestedFrom');
      if (!trade) {
        return res.status(404).json({ success: false, message: 'Trade request not found.' });
      }
  
      // Check if the logged-in user is the recipient of the trade
      if (trade.requestedFrom._id.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You are not authorized to accept this trade.' });
      }
  
      // Ensure the trade is still pending
      if (trade.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'This trade has already been processed.' });
      }
  
      // Update the trade status
      trade.status = 'accepted';
      await trade.save();
  
      // Optionally mark the items as traded
      await Item.findByIdAndUpdate(trade.offeredItem, { traded: true });
      await Item.findByIdAndUpdate(trade.requestedItem, { traded: true });
  
      return res.status(200).json({
        success: true,
        message: 'Trade accepted successfully.',
        trade,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  router.post('/reject-trade/:tradeId', fetchUser, async (req, res) => {
    try {
      const { tradeId } = req.params;
  
      // Find the trade request
      const trade = await Trade.findById(tradeId).populate('requestedFrom');
      if (!trade) {
        return res.status(404).json({ success: false, message: 'Trade request not found.' });
      }
  
      // Check if the logged-in user is the recipient of the trade
      if (trade.requestedFrom._id.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You are not authorized to reject this trade.' });
      }
  
      // Ensure the trade is still pending
      if (trade.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'This trade has already been processed.' });
      }
  
      // Update the trade status
      trade.status = 'rejected';
      await trade.save();
  
      return res.status(200).json({
        success: true,
        message: 'Trade rejected successfully.',
        trade,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  
  
  module.exports = router;


module.exports = router;
