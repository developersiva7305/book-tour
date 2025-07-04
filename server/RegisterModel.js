const mongoose = require("mongoose")


const RegisterSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    confirmPassword: String,
    phone: String
})

module.exports  = mongoose.model("user", RegisterSchema)
