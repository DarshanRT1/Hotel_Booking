const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    specialRequests: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);