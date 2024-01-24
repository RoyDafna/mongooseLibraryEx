const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: String,
  publishingYear: Number,
  genres: [String],
  authors: [ObjectId],
  quantity: Number,
  price: Number,
});
bookSchema.index({ title: "text" });
const Book = model("Book", bookSchema);
module.exports = Book;
