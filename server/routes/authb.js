// server/routes/authb.js
const express = require('express');
const router = express.Router();
const BookingModel = require('../BookingModel');

// POST booking
router.post('/booking/:placeId', async (req, res) => {
  try {
    const bookingData = { ...req.body, placeId: req.params.placeId };
    const newBooking = await BookingModel.create(bookingData);
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ message: 'Booking failed', error: err });
  }
});

module.exports = router;
