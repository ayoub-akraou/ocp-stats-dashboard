const express = require("express");
const router = express.Router();

// Importer un contrôleur
const AuthController = require("../controllers/AuthController.js");
// Importer un middleware
const auth = require("../middlewares/authMiddleware.js");
// Définir les routes
router.get("/", (req, res) => {
	res.send("Bienvenue sur l'API");
});

router.post("/login", AuthController.login);
router.post("/logout", auth, AuthController.logout);

module.exports = router;
