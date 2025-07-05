const ExcelModel = require("../utils/Excel.js");

class ExcelController {
	static getStats(req, res) {
		try {
			const data = ExcelModel.lireDonnees();
			console.log(data);

			// Taux de rupture
			const totalArticles = data.length;
			const ruptures = data.filter((ligne) => ligne["SommeDeSTOCK AE"] === 0).length;
			const tauxRupture = totalArticles ? (ruptures / totalArticles) * 100 : 0;

			res.status(200).json({
				tauxRupture, ruptures,
			});
		} catch (error) {
			console.error("Erreur dans getStats :", error);
			res.status(500).json({ message: "Erreur serveur" });
		}
	}
}

module.exports = ExcelController;
