const Order = require("../models/order");
const Book = require("../models/book");

module.exports = {
  orderBooks: async (items) => {
    let validOrderFlag = true;
    let totalPrice = 0;

    for (const currItem of items) {
      const currBook = await Book.findById(currItem.bookID);

      if (currBook.quantity >= currItem.amount) {
        totalPrice += currBook.price * currItem.amount;
      } else {
        validOrderFlag = false;
        break;
      }
    }

    if (validOrderFlag) {
      for (const currItem of items) {
        const currBook = await Book.findById(currItem.bookID);
        currBook.quantity -= currItem.amount;
        await currBook.save();
      }

      const newOrder = new Order({ items, totalPrice, date: Date.now() });
      return newOrder.save();
    } else {
      throw new Error("Not Enough Books in Storage.");
    }
  },
  findHighestPrice: async (startDate, endDate) => {
    let highestPricedOrder = null;

    const ordersInRange = await Order.find({
      date: { $gte: startDate, $lte: endDate },
    });

    for (const currOrder of ordersInRange) {
      if (
        highestPricedOrder == null ||
        highestPricedOrder.totalPrice < currOrder.totalPrice
      ) {
        highestPricedOrder = currOrder;
      }
    }

    return highestPricedOrder;
  },
  findPopularGenres: async (startDate, endDate) => {
    const start = new Date(Number(startDate));
    const end = new Date(Number(endDate));

    return await Order.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "items.bookID",
          foreignField: "_id",
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
      {
        $unwind: {
          path: "$connectedBooks.genres",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          "connectedBooks.genres": 1,
        },
      },
      {
        $group: {
          _id: "$connectedBooks.genres",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: 3,
      },
    ]);
  },
  getProfits: async (startDate, endDate) => {
    let profits = 0;

    const start = new Date(Number(startDate));
    const end = new Date(Number(endDate));

    const ordersInRange = await Order.find({
      date: { $gte: start, $lte: end },
    });

    for (currOrder of ordersInRange) {
      profits += currOrder.totalPrice;
    }

    return profits;
  },
  getPopularAuthors: async (startDate, endDate) => {
    const start = new Date(Number(startDate));
    const end = new Date(Number(endDate));
    return await Order.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $project: {
          items: 1,
          _id: 0,
        },
      },
      {
        $unwind: {
          path: "$items",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "items.bookID",
          foreignField: "_id",
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
          "items.amount": 1,
          "connectedBooks.authors": 1,
        },
      },
      {
        $unwind: {
          path: "$connectedBooks.authors",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "connectedBooks.authors",
          foreignField: "_id",
          as: "connectedAuthor",
        },
      },
      {
        $project: {
          items: 1,
          "connectedAuthor._id": 1,
        },
      },
      {
        $unwind: {
          path: "$connectedAuthor",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$connectedAuthor._id",
          totalAmount: {
            $sum: "$items.amount",
          },
        },
      },
      {
        $sort: {
          totalAmount: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "authors",
          localField: "_id",
          foreignField: "_id",
          as: "connectedAuthor",
        },
      },
      {
        $unwind: {
          path: "$connectedAuthor",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          connectedAuthor: 1,
          totalAmount: 1,
          _id: 0,
        },
      },
    ]);
  },
};
