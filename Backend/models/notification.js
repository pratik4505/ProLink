const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true,
  strict: false, // Allow any fields not explicitly specified in the schema
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
