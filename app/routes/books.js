const controller = require("../controllers/books");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/", cacheNoStore, controller.addBooks);
router.delete("/:id", cacheNoStore, controller.deleteBook);
router.get("/", cacheNoStore, controller.findBooks);

module.exports = router;
