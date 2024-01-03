const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  memberIds: {
    type: [{ type: String, required: true }],
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'A chat must have exactly two memberIds.',
    },
  },
  memberNames: {
    type: [{ type: String, required: true }],
    validate: {
      validator: function(arr) {
        return arr.length === 2; 
      },
      message: 'A chat must have exactly two memberNames.',
    },
  },
  imageUrls: {
    type: [{ type: String}],
  },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
