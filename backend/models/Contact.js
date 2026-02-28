const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: false, 
    sparse: true, 
  },
  phone: { type: String }, //  WhatsApp
  category: {
    type: String,
    enum: ["Семья", "Друзья", "Коллеги", "VIP", "Гость"],
    default: "Гость",
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", ContactSchema);
