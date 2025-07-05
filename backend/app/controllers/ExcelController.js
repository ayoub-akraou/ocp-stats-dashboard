const ExcelModel = require("../utils/Excel.js");

class ExcelController {
	static getStats(req, res) {
		try {
			const data = ExcelModel.lireDonnees();

			///////////////////////////////// Taux de rupture /////////////////////////////////
			const totalArticles = data.length;
			const ruptures = data.filter((article) => article["SommeDeSTOCK AE"] === 0).length;
			const tauxRupture = totalArticles ? (ruptures / totalArticles) * 100 : 0;

			///////////////////////////////// Taux de rotation des stocks /////////////////////////////////
			function classifierArticles(data) {
				const actifs = [];
				const dormants = [];
				const inutilises = [];
				const incoherents = [];

				data.forEach((article) => {
					const totalConso =
						(article["SommeDeCONS AE"] || 0) +
						(article["SommeDeCONS A-1"] || 0) +
						(article["SommeDeCONS A-2"] || 0) +
						(article["SommeDeCONS A-3"] || 0) +
						(article["SommeDeCONS A-4"] || 0);

					const totalStock =
						(article["SommeDeSTOCK AE"] || 0) +
						(article["SommeDeSTOCK A-1"] || 0) +
						(article["SommeDeSTOCK A-2"] || 0) +
						(article["SommeDeSTOCK A-3"] || 0) +
						(article["SommeDeSTOCK A-4"] || 0);

					if (totalConso > 0 && totalStock > 0) {
						actifs.push(article);
					} else if (totalConso === 0 && totalStock > 0) {
						dormants.push(article);
					} else if (totalConso === 0 && totalStock === 0) {
						inutilises.push(article);
					} else if (totalConso > 0 && totalStock === 0) {
						incoherents.push(article);
					}
				});

				return { actifs, dormants, inutilises, incoherents };
			}
			const { actifs, dormants, inutilises, incoherents } = classifierArticles(data);

			const rotationStocks = actifs
				.map((article) => {
					const totalConso =
						(article["SommeDeCONS AE"] || 0) +
						(article["SommeDeCONS A-1"] || 0) +
						(article["SommeDeCONS A-2"] || 0) +
						(article["SommeDeCONS A-3"] || 0) +
						(article["SommeDeCONS A-4"] || 0);

					const totalStock =
						(article["SommeDeSTOCK AE"] || 0) +
						(article["SommeDeSTOCK A-1"] || 0) +
						(article["SommeDeSTOCK A-2"] || 0) +
						(article["SommeDeSTOCK A-3"] || 0) +
						(article["SommeDeSTOCK A-4"] || 0);

					const moyenneConso = totalConso / 5;
					const moyenneStock = totalStock / 5;

					const tauxRotation = moyenneStock ? moyenneConso / moyenneStock : 0;

					return {
						article: article.ARTICLE,
						description: article.DESCRIPTION,
						categorie: article["CATEGORIE ACHAT"] || "",
						gestion: article["CLASSE HOMOGENE DE GESTION"] || "",
						unite: article.Udm,
						moyenneStock: Number(moyenneStock.toFixed(2)),
						moyenneConso: Number(moyenneConso.toFixed(2)),
						tauxRotation: Number(tauxRotation.toFixed(4)),
					};
				})
				.sort((a, b) => a.tauxRotation - b.tauxRotation);

			const lowRotation = rotationStocks.slice(0, 10);

			const topRotation = rotationStocks.slice(-10);

			///////////////////////////////// couvertureStocks /////////////////////////////////

			const couvertureStocks = data.map((article) => {
				// Moyenne de consommation mensuelle (sur 5 ans)
				const consommationMoyenneMensuelle =
					((article["SommeDeCONS AE"] || 0) +
						(article["SommeDeCONS A-1"] || 0) +
						(article["SommeDeCONS A-2"] || 0) +
						(article["SommeDeCONS A-3"] || 0) +
						(article["SommeDeCONS A-4"] || 0)) /
					(5 * 12); // sur 60 mois

				// Stock actuel
				const stockActuel = article["SommeDeSTOCK AE"] || 0;

				// Calcul du taux de couverture
				const tauxCouverture =
					consommationMoyenneMensuelle > 0
						? stockActuel / consommationMoyenneMensuelle
						: stockActuel > 0
						? Infinity // Stock dormant (consommation nulle mais stock présent)
						: 0; // Stock et consommation nuls

				// ✅ Interprétation avec cas spécial pour les stocks dormants
				let niveauCouverture = "";
				let niveauCouvertureColor = "";

				if (tauxCouverture === 0) {
					niveauCouverture = "rupture";
					niveauCouvertureColor = "red";
				} else if (tauxCouverture === Infinity) {
					niveauCouverture = "stock dormant (non utilisé)";
					niveauCouvertureColor = "purple"; // Couleur distincte pour ce cas
				} else if (tauxCouverture < 1) {
					niveauCouverture = "faible couverture";
					niveauCouvertureColor = "orange";
				} else if (tauxCouverture >= 1 && tauxCouverture <= 3) {
					niveauCouverture = "stock optimal";
					niveauCouvertureColor = "green";
				} else if (tauxCouverture > 3 && tauxCouverture <= 6) {
					niveauCouverture = "stock élevé";
					niveauCouvertureColor = "blue";
				} else {
					niveauCouverture = "surstock";
					niveauCouvertureColor = "gray";
				}

				return {
					article: article.ARTICLE,
					description: article.DESCRIPTION,
					categorie: article["CATEGORIE ACHAT"] || "",
					gestion: article["CLASSE HOMOGENE DE GESTION"] || "",
					unite: article["Udm"],
					stockActuel,
					consommationMoyenneMensuelle,
					tauxCouverture: Number(tauxCouverture.toFixed(2)), // arrondi à 2 chiffres
					niveauCouverture,
					niveauCouvertureColor,
				};
			});

			res.status(200).json({
				// // rupture
				// tauxRupture,
				// ruptures,
				// // rotationStocks
				// rotationStocks,
				// topRotation,
				// lowRotation,
				// // couvertureStocks
				couvertureStocks,
			});
		} catch (error) {
			console.error("Erreur dans getStats :", error);
			res.status(500).json({ message: "Erreur serveur" });
		}
	}
}

module.exports = ExcelController;
