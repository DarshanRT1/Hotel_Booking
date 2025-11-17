const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

// Create a new reservation
router.post('/', async (req, res) => {
  try {
    const { userId, date, time, partySize, name, email, phone, specialRequests } = req.body;
    
    // Only set userId if it's a valid ObjectId
    let validUserId = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      validUserId = userId;
    }
    
    const reservation = new Reservation({
      userId: validUserId,
      date,
      time,
      partySize,
      status: 'pending',
      customerInfo: {
        name,
        email,
        phone,
        specialRequests
      }
    });
    
    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all reservations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ 
      userId: req.params.userId 
    }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reservations by email
router.get('/email/:email', async (req, res) => {
  try {
    const reservations = await Reservation.find({ 
      'customerInfo.email': req.params.email 
    }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reservations (admin)
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update reservation status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;