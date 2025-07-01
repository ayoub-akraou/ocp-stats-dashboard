require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./app/routes/auth.routes");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));
