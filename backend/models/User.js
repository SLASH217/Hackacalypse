const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  itemsForTrade: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  ], // Link to items they have available for trade
});

module.exports = mongoose.model('User', UserSchema);
