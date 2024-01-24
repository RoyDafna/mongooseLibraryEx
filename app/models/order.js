const { ObjectId, Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  items: [{ bookID: ObjectId, amount: Number }],
  totalPrice: Number,
  date: Date,
});

const Order = model("Order", orderSchema);
module.exports = Order;
