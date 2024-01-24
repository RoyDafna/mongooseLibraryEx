const {
  orderBooks,
  findHighestPrice,
  findPopularGenres,
  getProfits,
  getPopularAuthors,
} = require("../services/orders");

module.exports = {
  orderBook: async (req, res) => {
    try {
      const { items } = req.body;
      const newOrder = await orderBooks(items);
      res.json(newOrder);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  findHighestPrice: async (req, res) => {
    try {
      const dateRange = {
        startDate: Date.now() - 1000 * 60 * 60 * 24 * 31,
        endDate: Date.now(),
      };

      const highestPricedOrder = await findHighestPrice(
        dateRange.startDate,
        dateRange.endDate
      );
      res.json(highestPricedOrder);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  findPopularGenres: async (req, res) => {
    try {
      const dateRange = {
        startDate: new Date(Number(req.query.startDate)),
        endDate: new Date(Number(req.query.endDate)),
      };

      const top3PopularGenres = await findPopularGenres(
        dateRange.startDate,
        dateRange.endDate
      );
      res.json(top3PopularGenres);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getProfits: async (req, res) => {
    try {
      const dateRange = {
        startDate: new Date(Number(req.query.startDate)),
        endDate: new Date(Number(req.query.endDate)),
      };

      const profits = await getProfits(dateRange.startDate, dateRange.endDate);

      res.json(profits);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getPopularAuthors: async (req, res) => {
    try {
      const dateRange = {
        startDate: new Date(Number(req.query.startDate)),
        endDate: new Date(Number(req.query.endDate)),
      };

      const popularAuthors = await getPopularAuthors(dateRange.startDate, dateRange.endDate);
      res.json(popularAuthors);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
