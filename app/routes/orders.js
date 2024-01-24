const controller = require("../controllers/orders");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/", cacheNoStore, controller.orderBook);
router.get("/findByPrice/", cacheNoStore, controller.findHighestPrice);
router.get("/findByGenres/", cacheNoStore, controller.findPopularGenres);
router.get("/profits/", cacheNoStore, controller.getProfits);
router.get("/getPopularAuthors/", cacheNoStore, controller.getPopularAuthors);


module.exports = router;
