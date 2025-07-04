const express = require('express');
const router = express.Router();
const NotifyModel = require('../NotifyModel');
const nodemailer = require('nodemailer');

router.post("/booking/:placeId", async (req, res) => {
  try {
    const { userId} = req.body;

// Create a booking
const booking = new Booking({
  userId: user.id,
  placeId:place.id,
  date: new Date(),
  status: "confirmed"
});

await booking.save();

// Find user by ID
const user =  User.findById(userId);

if (!user || !user.email) {
  return res.status(404).json({ success: false, message: "User not found or missing email" });
}

// Send confirmation email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,     // e.g. siva7305852@gmail.com
    pass: process.env.GMAIL_PASS      // use app password if 2FA enabled
  }
});

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: user.email,
  subject: "Your Tour Booking Confirmation",
  html: `
    <h2>Hello ${user.name},</h2>
    <p>Thank you for booking your tour with us!</p>
    <ul>
      <li>Booking Date: ${booking.date.toDateString()}</li>
      <li>Place ID: ${placeId}</li>
    </ul>
    <p>We hope you enjoy your trip!</p>
  `
};

await transporter.sendMail(mailOptions);

res.status(200).json({
  success: true,
  message: "Booking successful and confirmation email sent."
});
} catch (err) {
    console.error("Booking error: ", err);
    res.status(500).json({
      success: false,
      message: "Booking failed. Please try again later."
    });
  }
  });
module.exports = router;