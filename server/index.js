const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")


const RegisterModel = require("./RegisterModel");
const BookingModel = require("./BookingModel");

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api', require('./routes/authr'));
app.use('/api', require('./routes/authb'));
app.use('/api', require('./routes/authnt'));

require('dotenv').config(); // Load variables from .env

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

app.post("/register", (req, res) => {
  RegisterModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => {
      console.error("Register error:", err);
      res.status(500).json({ message: "Registration failed", error: err });
    });
});

app.post("/booking/:placeId", (req, res) => {
  BookingModel.create(req.body)
    .then(booking => res.json(booking))
    .catch(err => {
      console.error("Booking error:", err);
      res.status(500).json({ message: "Booking failed", error: err });
    });
});

app.listen(3000, () => {
  console.log("server is running 3000")
})