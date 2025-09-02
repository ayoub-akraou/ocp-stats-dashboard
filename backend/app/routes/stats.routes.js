const express = require("express");
const router = express.Router();

const StatsController = require("../controllers/StatsController.js");
const auth = require("../middlewares/authMiddleware.js");

router.get("/ruptures", StatsController.getRuptureStats);
router.get("/rotation-stock", StatsController.getRotationStats);
router.get("/couverture-stock", StatsController.getCouvertureStats);
router.get("/valeur-stock", StatsController.getValeurStock);
router.get("/valeur-stock-non-mouvemente", StatsController.getValeurStockNonMouvemente);

module.exports = router;
