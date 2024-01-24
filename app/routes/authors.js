const controller = require("../controllers/authors");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/", cacheNoStore, controller.addAuthor);
router.post("/:id", cacheNoStore, controller.updateAuthor);

module.exports = router;
