// server/models/BookingModel.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  placeId: String,
  placeName: String,
  userName: String,
  email: String,
  phone: String,
  dateOfVisit: String,
  numberOfPeople: String,
  paymentMethod: String,
});

module.exports = mongoose.model("Booking", BookingSchema);
