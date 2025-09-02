const ExcelModel = require("../utils/Excel.js");

class ExcelController {
	getRuptureStats(req, res) {
		try {
			const data = ExcelModel.lireDonnees();
			const totalArticles = data.length;
			const getTauxRupture = (ruptures) => (totalArticles ? ((ruptures / totalArticles) * 100).toFixed(2) : 0);
			// annee en cours
			const rupturesAE = data.filter((article) => article["SommeDeSTOCK AE"] === 0).length;
			const tauxRuptureAE = getTauxRupture(rupturesAE);
			// annee 1
			const rupturesA1 = data.filter((article) => article["SommeDeSTOCK A-1"] === 0).length;
			const tauxRuptureA1 = getTauxRupture(rupturesA1);
			// annee 2
			const rupturesA2 = data.filter((article) => article["SommeDeSTOCK A-2"] === 0).length;
			const tauxRuptureA2 = getTauxRupture(rupturesA2);
			// annee 3
			const rupturesA3 = data.filter((article) => article["SommeDeSTOCK A-3"] === 0).length;
			const tauxRuptureA3 = getTauxRupture(rupturesA3);
			// annee 4
			const rupturesA4 = data.filter((article) => article["SommeDeSTOCK A-4"] === 0).length;
			const tauxRuptureA4 = getTauxRupture(rupturesA4);

			res.status(200).json({
				tauxRupture: [tauxRuptureAE, tauxRuptureA1, tauxRuptureA2, tauxRuptureA3, tauxRuptureA4].reverse(),
				success: true,
			});
		} catch (error) {
			res.status(500).json({ message: error.message, success: false });
		}
	}
	getRotationStats(req, res) {
		try {
			const data = ExcelModel.lireDonnees();
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

					const tauxRotation = moyenneStock ? (moyenneConso / moyenneStock) * 100 : Infinity;

					return {
						article: article.ARTICLE,
						description: article.DESCRIPTION,
						categorie: article["CATEGORIE ACHAT"] || "",
						gestion: article["CLASSE HOMOGENE DE GESTION"] || "",
						unite: article.Udm,
						moyenneStock: Number(moyenneStock.toFixed(2)) + " " + article.Udm,
						moyenneConso: Number(moyenneConso.toFixed(2)) + " " + article.Udm,
						tauxRotation: Number(tauxRotation.toFixed(4)) + " %",
					};
				})
				.sort((a, b) => parseFloat(a.tauxRotation) - parseFloat(b.tauxRotation));

			// Répartition des taux de rotation par tranche
			const repartitionRotation = {
				faible: 0, // < 1 %
				moyenne: 0, // 1 % - 3 %
				elevee: 0, // 3 % - 10 %
				tres_elevee: 0, // > 10 %
			};

			rotationStocks.forEach((article) => {
				const taux = parseFloat(article.tauxRotation);
				if (isNaN(taux) || taux === Infinity) return;

				const SEUIL_FAIBLE = 1;
				const SEUIL_MOYEN = 3;
				const SEUIL_ELEVE = 10;

				if (taux < SEUIL_FAIBLE) {
					repartitionRotation.faible++;
				} else if (taux >= SEUIL_FAIBLE && taux < SEUIL_MOYEN) {
					repartitionRotation.moyenne++;
				} else if (taux >= SEUIL_MOYEN && taux <= SEUIL_ELEVE) {
					repartitionRotation.elevee++;
				} else {
					repartitionRotation.tres_elevee++;
				}
			});

			const lowRotation = rotationStocks.slice(0, 10);

			const topRotation = rotationStocks.slice(-10);
			res.json({
				data: {
					// stocks: rotationStocks,
					repartitionRotation,
					lowRotation,
					topRotation,
				},
				success: true,
			});
		} catch (error) {
			res.json({ message: "Erreur serveur!", success: false });
		}
	}

	getCouvertureStats(req, res) {
		try {
			const data = ExcelModel.lireDonnees();
			let couvertureStocks = data.map((article) => {
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
						? (stockActuel / consommationMoyenneMensuelle) * 100
						: stockActuel > 0
						? "Infinity"
						: 0;

				// ✅ Interprétation avec cas spécial pour les stocks dormants
				let niveauCouverture = "";
				let niveauCouvertureColor = "";

				if (tauxCouverture === 0) {
					niveauCouverture = "rupture";
					niveauCouvertureColor = "red";
				} else if (tauxCouverture === "Infinity") {
					niveauCouverture = "stock dormant"; // (non utilisé)
					niveauCouvertureColor = "gray"; // Couleur distincte pour ce cas
				} else if (tauxCouverture < 200) {
					niveauCouverture = "faible";
					niveauCouvertureColor = "orange";
				} else if (tauxCouverture >= 200 && tauxCouverture <= 300) {
					niveauCouverture = "stock optimal";
					niveauCouvertureColor = "green";
				} else if (tauxCouverture > 300 && tauxCouverture <= 600) {
					niveauCouverture = "stock élevé";
					niveauCouvertureColor = "blue";
				} else {
					niveauCouverture = "surstock";
					niveauCouvertureColor = "black";
				}

				return {
					article: article.ARTICLE,
					description: article.DESCRIPTION,
					categorie: article["CATEGORIE ACHAT"] || "",
					gestion: article["CLASSE HOMOGENE DE GESTION"] || "",
					unite: article["Udm"],
					stockActuel: stockActuel.toFixed(2),
					consommationMoyenneMensuelle: consommationMoyenneMensuelle.toFixed(2),
					tauxCouverture: tauxCouverture == "Infinity" ? tauxCouverture : tauxCouverture.toFixed(2) + " %", // arrondi à 2 chiffres
					niveauCouverture,
					niveauCouvertureColor,
				};
			});

			let filteredCouvertureStocks = couvertureStocks;

			// search
			const query = req.query.query?.toLocaleLowerCase().trim();
			if (query)
				filteredCouvertureStocks = couvertureStocks.filter(
					(a) => a.article.toLocaleLowerCase().includes(query) || a.description.toLocaleLowerCase().includes(query)
				);
			const totalSearchedArticles = filteredCouvertureStocks.length;
			// obtenir le nombre total des articles selon un niveau de couverture:
			const getTotalSearched = (niveau) =>
				filteredCouvertureStocks.filter((a) => a.niveauCouverture == niveau).length;
			const getTotal = (niveau) => couvertureStocks.filter((a) => a.niveauCouverture == niveau).length;
			const filters = [
				{
					niveauCouverture: "rupture",
					niveauCouvertureColor: "red",
					total: getTotal("rupture"),
					totalSearched: getTotalSearched("rupture"),
				},
				{
					niveauCouverture: "stock dormant",
					niveauCouvertureColor: "gray",
					total: getTotal("stock dormant"),
					totalSearched: getTotalSearched("stock dormant"),
				},
				{
					niveauCouverture: "faible",
					niveauCouvertureColor: "orange",
					total: getTotal("faible"),
					totalSearched: getTotalSearched("faible"),
				},
				{
					niveauCouverture: "stock optimal",
					niveauCouvertureColor: "green",
					total: getTotal("stock optimal"),
					totalSearched: getTotalSearched("stock optimal"),
				},
				{
					niveauCouverture: "stock élevé",
					niveauCouvertureColor: "blue",
					total: getTotal("stock élevé"),
					totalSearched: getTotalSearched("stock élevé"),
				},
				{
					niveauCouverture: "surstock",
					niveauCouvertureColor: "black",
					total: getTotal("surstock"),
					totalSearched: getTotalSearched("surstock"),
				},
			];
			// filter
			const filterBy = req.query.filterBy;
			if (filterBy)
				filteredCouvertureStocks = filteredCouvertureStocks.filter(
					(article) => article.niveauCouverture.toLocaleLowerCase() === filterBy.toLocaleLowerCase()
				);
			const totalFilteredAricles = filteredCouvertureStocks.length;
			// pagination
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 100;
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;
			filteredCouvertureStocks = filteredCouvertureStocks.slice(startIndex, endIndex);
			const totalArticles = couvertureStocks.length;

			res.json({
				success: true,
				couvertureStocks: filteredCouvertureStocks,
				page,
				limit,
				totalArticles,
				totalSearchedArticles,
				totalFilteredAricles,
				totalPages: Math.ceil(totalFilteredAricles / limit),
				filters,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message || "Erreur serveur!" });
		}
	}

	getValeurStock(req, res) {
		try {
			const data = ExcelModel.lireDonnees();
			const totalArticles = data.length;
			let valeurStockTotale = 0;
			let valeurParArticle = data.map((article) => {
				const stockActuel = Math.max(article["SommeDeSTOCK AE"] || 0, 0); // pour eviter les valeurs negatifs
				const pmp = article["PMP"] || 0;
				const valeur = stockActuel * pmp;

				valeurStockTotale += valeur;

				return {
					article: article["ARTICLE"],
					description: article["DESCRIPTION"],
					unite: article["Udm"],
					stockActuel,
					pmp,
					valeur: Number(valeur.toFixed(2)),
				};
			});

			// search
			let SearchedArticles = valeurParArticle;
			const query = req.query.query?.toLocaleLowerCase().trim();
			if (query)
				SearchedArticles = valeurParArticle.filter(
					(a) => a.article.toLocaleLowerCase().includes(query) || a.description.toLocaleLowerCase().includes(query)
				);
			const totalSearchedArticles = SearchedArticles.length;

			// sort
			let sortedArticles = SearchedArticles;
			const sortBy = req.query.sortBy;
			if (sortBy) {
				sortedArticles = valeurParArticle.sort((a, b) => {
					switch (sortBy) {
						case "price-asc":
							return a.pmp - b.pmp;
						case "price-desc":
							return b.pmp - a.pmp;
						case "valeur-asc":
							return a.valeur - b.valeur;
						case "valeur-desc":
							return b.valeur - a.valeur;
						case "stock-asc":
							return a.stockActuel - b.stockActuel;
						case "stock-desc":
							return b.stockActuel - a.stockActuel;
					}
				});
			}

			// pagination
			const limit = req.query.limit || 200;
			const page = req.query.page || 1;
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;
			const totalPages = Math.ceil(totalSearchedArticles / limit);

			res.json({
				success: true,
				stocks: sortedArticles.slice(startIndex, endIndex),
				valeurStockTotale,
				totalArticles,
				totalSearchedArticles,
				totalPages,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}

	getValeurStockNonMouvemente(req, res) {
		try {
			const data = ExcelModel.lireDonnees();
			let stockNonmouvemente = data.filter((article) => {
				const consoTotale =
					(article["SommeDeCONS AE"] || 0) +
					(article["SommeDeCONS A-1"] || 0) +
					(article["SommeDeCONS A-2"] || 0) +
					(article["SommeDeCONS A-3"] || 0) +
					(article["SommeDeCONS A-4"] || 0);

				const stock = article["SommeDeSTOCK AE"] || 0;
				return consoTotale === 0 && stock > 0;
			});
			const totalArticles = stockNonmouvemente.length;
			let valeurStockTotale = 0;
			let valeurParArticle = stockNonmouvemente.map((article) => {
				const stockActuel = Math.max(article["SommeDeSTOCK AE"] || 0, 0); // pour eviter les valeurs negatifs
				const pmp = article["PMP"] || 0;
				const valeur = stockActuel * pmp;

				valeurStockTotale += valeur;

				return {
					article: article["ARTICLE"],
					description: article["DESCRIPTION"],
					unite: article["Udm"],
					stockActuel,
					pmp,
					valeur: Number(valeur.toFixed(2)),
				};
			});

			// search
			let SearchedArticles = valeurParArticle;
			const query = req.query.query?.toLocaleLowerCase().trim();
			if (query)
				SearchedArticles = valeurParArticle.filter(
					(a) => a.article.toLocaleLowerCase().includes(query) || a.description.toLocaleLowerCase().includes(query)
				);
			const totalSearchedArticles = SearchedArticles.length;

			// sort
			let sortedArticles = SearchedArticles;
			const sortBy = req.query.sortBy;
			if (sortBy) {
				sortedArticles = valeurParArticle.sort((a, b) => {
					switch (sortBy) {
						case "price-asc":
							return a.pmp - b.pmp;
						case "price-desc":
							return b.pmp - a.pmp;
						case "valeur-asc":
							return a.valeur - b.valeur;
						case "valeur-desc":
							return b.valeur - a.valeur;
						case "stock-asc":
							return a.stockActuel - b.stockActuel;
						case "stock-desc":
							return b.stockActuel - a.stockActuel;
					}
				});
			}

			// pagination
			const limit = req.query.limit || 200;
			const page = req.query.page || 1;
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;
			const totalPages = Math.ceil(totalSearchedArticles / limit);

			res.json({
				success: true,
				stocks: sortedArticles.slice(startIndex, endIndex),
				valeurStockTotale,
				totalArticles,
				totalSearchedArticles,
				totalPages,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}
}

module.exports = new ExcelController();
