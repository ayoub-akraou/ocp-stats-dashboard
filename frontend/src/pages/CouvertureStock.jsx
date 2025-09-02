import React, { useEffect, useRef, useState } from "react";
import {
	Search,
	Package,
	Activity,
	AlertTriangle,
	CheckCircle,
	XCircle,
	ChevronLeft,
	ChevronRight,
	BarChart3,
	TrendingDown,
	TrendingUp,
	Calendar,
} from "lucide-react";
import fetchApi from "../services/api";
import { useLoader } from "../context/LoaderContext";

const format = (value) => {
	if (value >= 1) return `${value.toFixed(1)} mois`;
	if (value >= 0.1) return `${(value * 30).toFixed(0)} jours`;
	return `${(value * 30 * 24).toFixed(0)} heures`;
};

const getNiveauIcon = (niveau) => {
	switch (niveau) {
		case "rupture":
			return <XCircle className="w-4 h-4" />;
		case "faible":
			return <AlertTriangle className="w-4 h-4" />;
		case "stock optimal":
			return <CheckCircle className="w-4 h-4" />;
		case "stock élevé":
			return <TrendingUp className="w-4 h-4" />;
		case "surstock":
			return <TrendingDown className="w-4 h-4" />;
		case "stock dormant":
			return <Activity className="w-4 h-4" />;
		default:
			return <Activity className="w-4 h-4" />;
	}
};

const getColorMapping = (colorName) => {
	switch (colorName) {
		case "red":
			return "#ef4444";
		case "orange":
			return "#f59e0b";
		case "green":
			return "#22c55e";
		case "blue":
			return "#3b82f6";
		case "black":
			return "#1f2937";
		case "gray":
			return "#6b7280";
		default:
			return "#6b7280";
	}
};

export default function CouvertureStock() {
	const tableHeader = useRef(null);
	const [stocks, setStocks] = useState(null);
	const { setLoading } = useLoader();
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const limit = 200;
	const [totalPages, setTotalPages] = useState(1);
	const [totalArticles, setTotalArticles] = useState(null);
	const [totalSearchedArticles, setTotalSearchedArticles] = useState(null);
	const [totalFilteredArticles, setTotalFilteredArticles] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterBy, setFilterBy] = useState("");
	const [filters, setFilters] = useState([]);
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				const res = await fetchApi(
					`/stats/couverture-stock?page=${page}&limit=${limit}&query=${searchInput}&filterBy=${filterBy}`
				);
				if (res.success) {
					setStocks(res.couvertureStocks);
					setTotalArticles(res.totalArticles);
					setTotalSearchedArticles(res.totalSearchedArticles);
					setTotalFilteredArticles(res.totalFilteredAricles);
					setTotalPages(res.totalPages);
					setFilters(res.filters);
				} else {
					setError("Échec du chargement");
				}
			} catch (err) {
				setError("Erreur serveur");
			} finally {
				setLoading(false);
			}
		};

		getData();
	}, [page, limit, searchQuery, filterBy]);

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<XCircle className="w-8 h-8 text-red-600" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
					<p className="text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
				</div>
			</div>
		);
	}

	if (!stocks) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
						<BarChart3 className="w-8 h-8 text-blue-600" />
					</div>
					<div className="text-gray-600">Chargement de l'analyse...</div>
				</div>
			</div>
		);
	}

	const getRuptureCount = () => filters.find((f) => f.niveauCouverture === "rupture")?.total || 0;
	const getFaibleCount = () => filters.find((f) => f.niveauCouverture === "faible")?.total || 0;
	const getOptimalCount = () => filters.find((f) => f.niveauCouverture === "stock optimal")?.total || 0;
	const getEleveCount = () => filters.find((f) => f.niveauCouverture === "stock élevé")?.total || 0;
	const getSurstockCount = () => filters.find((f) => f.niveauCouverture === "surstock")?.total || 0;
	const getDormantCount = () => filters.find((f) => f.niveauCouverture === "stock dormant")?.total || 0;

	return (
		<>
			{/* Header avec titre et statistiques */}
			<div className="mb-8">
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
								<BarChart3 className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
									Analyse de Couverture des Stocks
								</h1>
								<p className="text-gray-600 text-sm">Suivi des niveaux de stock et prévisions</p>
							</div>
						</div>

						<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
							<Calendar className="w-5 h-5" />
							<span>{totalArticles} articles analysés</span>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
						<div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-red-100 text-sm font-medium">Rupture</span>
								<XCircle className="w-5 h-5 text-red-100" />
							</div>
							<div className="text-xl font-bold">{getRuptureCount()}</div>
							<div className="text-red-100 text-xs">articles en rupture</div>
						</div>

						<div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-amber-100 text-sm font-medium">Faible</span>
								<AlertTriangle className="w-5 h-5 text-amber-100" />
							</div>
							<div className="text-xl font-bold">{getFaibleCount()}</div>
							<div className="text-amber-100 text-xs">articles à surveiller</div>
						</div>

						<div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-green-100 text-sm font-medium">Optimal</span>
								<CheckCircle className="w-5 h-5 text-green-100" />
							</div>
							<div className="text-xl font-bold">{getOptimalCount()}</div>
							<div className="text-green-100 text-xs">articles bien gérés</div>
						</div>

						<div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-blue-100 text-sm font-medium">Élevé</span>
								<TrendingUp className="w-5 h-5 text-blue-100" />
							</div>
							<div className="text-xl font-bold">{getEleveCount()}</div>
							<div className="text-blue-100 text-xs">articles en surstockage</div>
						</div>

						<div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-gray-100 text-sm font-medium">Surstock</span>
								<TrendingDown className="w-5 h-5 text-gray-100" />
							</div>
							<div className="text-xl font-bold">{getSurstockCount()}</div>
							<div className="text-gray-100 text-xs">articles en surstock</div>
						</div>

						<div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-4 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-gray-100 text-sm font-medium">Dormant</span>
								<Activity className="w-5 h-5 text-gray-100" />
							</div>
							<div className="text-xl font-bold">{getDormantCount()}</div>
							<div className="text-gray-100 text-xs">articles dormants</div>
						</div>
					</div>
				</div>
			</div>

			{/* Barre de recherche */}
			<div
				className={`flex mb-4 items-center gap-2 bg-white/90 pl-4 pr-4 py-3 border-2  rounded-xl focus:ring-2 ${
					isSearchFocused ? "border-emerald-500" : "border-gray-200"
				} transition-all duration-200`}>
				<div className=" w-full flex items-center gap-2">
					<Search
						className={`  w-6 h-6 transition-colors ${isSearchFocused ? "text-emerald-500" : "text-gray-400"}`}
					/>
					<input
						type="text"
						placeholder="Rechercher un article..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						onFocus={() => setIsSearchFocused(true)}
						onBlur={() => setIsSearchFocused(false)}
						className="w-full outline-none"
					/>
				</div>
				<button
					onClick={() => {
						setSearchQuery(searchInput);
						setPage(1);
					}}
					className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-semibold hover:to-teal-500 transition-all duration-1000">
					Rechercher
				</button>
			</div>

			{/* Filtres */}
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
				<div className="flex flex-wrap gap-3 items-center">
					<div className="flex items-center gap-2 text-gray-700 font-semibold">
						<Package className="w-5 h-5" />
						<span>Filtres :</span>
					</div>

					{/* Bouton "Tous" */}
					<button
						onClick={() => {
							setFilterBy("");
							setPage(1);
						}}
						className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
							filterBy === ""
								? "bg-gray-900 text-white shadow-lg"
								: "bg-white/80 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
						}`}>
						<Activity className="w-4 h-4" />
						Tous : {totalSearchedArticles}
					</button>

					{/* Autres filtres */}
					{filters.map((filter) => {
						const isActive = filter.niveauCouverture === filterBy;
						return (
							<button
								key={filter.niveauCouverture}
								onClick={() => {
									setFilterBy(filter.niveauCouverture);
									setPage(1);
								}}
								className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
									isActive
										? "text-white shadow-lg transform scale-105"
										: "bg-white/80 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
								}`}
								style={{
									backgroundColor: isActive ? getColorMapping(filter.niveauCouvertureColor) : undefined,
									borderColor: isActive ? getColorMapping(filter.niveauCouvertureColor) : undefined,
								}}>
								{getNiveauIcon(filter.niveauCouverture)}
								{filter.niveauCouverture} : {filter.totalSearched}
							</button>
						);
					})}
				</div>
			</div>

			{/* Tableau */}
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-xs text-nowrap">
						<thead
							ref={tableHeader}
							className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
							<tr>
								<th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Article</th>
								<th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
								<th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Unité</th>
								<th className="px-3 py-4 text-right text-sm font-semibold text-gray-900">Stock actuel</th>
								<th className="px-3 py-4 text-right text-sm font-semibold text-gray-900">Conso. mensuelle</th>
								<th className="px-3 py-4 text-right text-sm font-semibold text-gray-900">Taux de couverture</th>
								<th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">Niveau</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{stocks.length === 0 && (
								<tr>
									<td colSpan="7" className="text-center py-6 text-gray-500 italic text-base">
										Aucun article trouvé !
									</td>
								</tr>
							)}
							{stocks.map((art, index) => (
								<tr key={index} className="hover:bg-purple-50/30 transition-all duration-200 group">
									<td className="px-3 py-4">
										<div className="flex items-center gap-3">
											<div className="px-2 py-1.5 bg-gradient-to-br from-emerald-300 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
												{art.article}
											</div>
										</div>
									</td>
									<td className="px-3 py-4">
										<div className="max-w-xs">
											<div className="text-gray-900 font-medium truncate" title={art.description}>
												{art.description.length > 30
													? art.description.slice(0, 30) + "..."
													: art.description}
											</div>
										</div>
									</td>
									<td className="px-3 py-4">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											{art.unite}
										</span>
									</td>
									<td className="px-3 py-4 text-right">
										<div className="text-gray-900 font-semibold">{art.stockActuel}</div>
									</td>
									<td className="px-3 py-4 text-right">
										<div className="text-gray-700">{art.consommationMoyenneMensuelle}</div>
									</td>
									<td className="px-3 py-4 text-right">
										<div className="text-gray-900 font-semibold">{art.tauxCouverture}</div>
										<div className="text-xs text-gray-500 mt-1">{format(parseFloat(art.tauxCouverture))}</div>
									</td>
									<td className="px-3 py-4 text-center">
										<span
											className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
											style={{ backgroundColor: getColorMapping(art.niveauCouvertureColor) }}>
											{getNiveauIcon(art.niveauCouverture)}
											{art.niveauCouverture}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			<div className="flex justify-center items-center gap-4 mt-8">
				<button
					onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
					disabled={page === 1}
					className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
					<ChevronLeft className="w-4 h-4" />
					Précédent
				</button>

				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600">
						Page <span className="font-semibold text-gray-900">{page}</span> sur{" "}
						<span className="font-semibold text-gray-900">{totalPages}</span>
					</span>
				</div>

				<button
					onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
					disabled={page === totalPages}
					className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
					Suivant
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</>
	);
}
