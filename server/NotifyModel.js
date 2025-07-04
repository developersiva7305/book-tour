const mongoose = require("mongoose")

const NotifySchema = new mongoose.Schema({
  userId: String,
  placeId: String,
  userName: String,
  email: String,
  date: Date,
});

module.exports  = mongoose.model("Notify", NotifySchema);
