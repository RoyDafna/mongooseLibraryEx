const { addAuthor, updateAuthor } = require("../services/authors");

module.exports = {
  addAuthor: async (req, res) => {
    try {
      const { name, country } = req.body;
      const newAuthor = await addAuthor(name, country);
      res.json(newAuthor);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  updateAuthor: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, country } = req.body;
      const author = await updateAuthor(id, name, country);
      res.json(author);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
