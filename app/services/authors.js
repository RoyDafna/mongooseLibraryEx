const Author = require("../models/author");

module.exports = {
  addAuthor: async (name, country) => {
    const newAuthor = new Author({ name, country });
    return newAuthor.save();
  },
  updateAuthor: async (id, name, country) => {
    const authorToUpdate = await Author.findById(id).exec();
    authorToUpdate.name = name;
    authorToUpdate.country = country;
    return authorToUpdate.save();
  },
};
