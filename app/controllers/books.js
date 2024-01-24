const { query } = require("express");
const {
  addBooks,
  deleteBook,
  findAuthorBooks,
  findAllBooks,
  findBooksByWord,
  findBooksByGenre,
  findBooksByYearRange,
  findBooksByAuthorCountry,
} = require("../services/books");

module.exports = {
  addBooks: async (req, res) => {
    try {
      const { newBooksArray } = req.body;
      const newBooks = await addBooks(newBooksArray);
      res.json(newBooks);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteBook: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedBook = await deleteBook(id);
      res.json(deletedBook);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  findBooks: async (req, res) => {
    try {
      let booksFound;
      let query = { page: 1 };

      if (Object.keys(req.query).length == 0) {
        booksFound = await findAllBooks(query.page);
      } else {
        query = { ...query, ...req.query };

        if (
          Object.keys(req.query).length == 1 &&
          req.query.hasOwnProperty("page")
        ) {
          booksFound = await findAllBooks(query.page);
        }

        if (query.hasOwnProperty("word")) {
          booksFound = await findBooksByWord(query.word, query.page);
        } else if (query.hasOwnProperty("authorID")) {
          booksFound = await findAuthorBooks(query.authorID, query.page);
        } else if (query.hasOwnProperty("genre")) {
          booksFound = await findBooksByGenre(query.genre, query.page);
        } else if (
          query.hasOwnProperty("startYear") &&
          query.hasOwnProperty("endYear")
        ) {
          booksFound = await findBooksByYearRange(
            query.startYear,
            query.endYear,
            query.page
          );
        } else if (query.hasOwnProperty("authorCountry")) {
          booksFound = await findBooksByAuthorCountry(
            query.authorCountry,
            query.page
          );
        }
      }

      res.json(booksFound);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
