require("dotenv").config(); //charger les variables d'environnement

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les requetes JSON
app.use(express.json());

// importer les routes
const apiRoutes = require("./app/routes/api.routes");
app.use("/api", apiRoutes);

app.use((req, res) => {
	res.status(404).json({ message: "Route non trouvée" });
});

app.listen(PORT, () => {
	console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
