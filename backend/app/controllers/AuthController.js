const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
	async login(req, res) {
		try {
			const { username, password } = req.body;

			const user = await User.findOne({ where: { username } });
			if (!user) {
				return res.status(401).json({ success: false, message: "Utilisateur introuvable" });
			}

			const valid = await bcrypt.compare(password, user.password);
			if (!valid) {
				return res.status(401).json({ success: false, message: "Mot de passe invalide" });
			}

			const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

			res.json({ success: true, message: "Connexion réussie", token });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	logout(req, res) {
		res.json({ message: "Déconnexion réussie (supprimer le token côté client)" });
	}
}

module.exports = new AuthController();
