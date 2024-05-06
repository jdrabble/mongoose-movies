const express = require("express");
const router = express.Router();
const reviewsCtrl = require("../controllers/reviews");
const ensureLoggedIn = require("../config/ensureLoggedIn");

router.post("/movies/:id/reviews", ensureLoggedIn, reviewsCtrl.create);
router.get("/reviews/edit/:id", ensureLoggedIn, reviewsCtrl.edit);
router.put("/reviews/update/:id", ensureLoggedIn, reviewsCtrl.update);
router.delete("/reviews/:id", ensureLoggedIn, reviewsCtrl.delete);

module.exports = router;
