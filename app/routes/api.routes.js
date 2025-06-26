const express = require("express");
const router = express.Router();

// Importer un contrôleur
// const UserController = require('../controllers/UserController');

// Définir les routes
router.get("/", (req, res) => {
	res.send("Bienvenue sur l'API");
});

// router.get('/users', UserController.index);
// router.post('/users', UserController.store);

module.exports = router;
