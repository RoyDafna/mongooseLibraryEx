const Book = require("../models/book");
const Author = require("../models/author");
const PAGE_SIZE = 10;

module.exports = {
  addBooks: async (newBooksArray) => {
    return Book.insertMany(newBooksArray);
  },
  deleteBook: async (id) => {
    return Book.findByIdAndDelete(id);
  },
  findAuthorBooks: async (authorID, page) => {
    const books = await Book.find({ authors: authorID })
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE);
    return books;
  },
  findAllBooks: async (page) => {
    const books = await Book.find()
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE);
    return books;
  },
  findBooksByWord: async (word, page) => {
    const books = await Book.find({ $text: { $search: word } })
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE);
    return books;
  },
  findBooksByGenre: async (genre, page) => {
    const books = await Book.find({ genres: genre })
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE);
    return books;
  },
  findBooksByYearRange: async (startYear, endYear, page) => {
    const books = await Book.find({
      publishingYear: { $gte: startYear, $lte: endYear },
    })
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE);
    return books;
  },
  findBooksByAuthorCountry: async (authorCountry, page) => {
    try {
      const books = await Author.aggregate([
        {
          $match: {
            country: "Israel",
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "authors",
            as: "connectedBooks",
          },
        },
        {
          $unwind: {
            path: "$connectedBooks",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            connectedBooks: 1,
            _id: 0,
          },
        },
        { $skip: PAGE_SIZE * (page - 1) },
        { $limit: PAGE_SIZE },
      ]);
      return books;
    } catch (err) {
      console.log(err);
    }
  },
};
