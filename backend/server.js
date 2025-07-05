require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use(express.json());

const authRoutes = require("./app/routes/auth.routes");
const ExcelController = require("./app/controllers/ExcelController");

app.use("/api", authRoutes);

app.get("/api/stats", ExcelController.getStats);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));
