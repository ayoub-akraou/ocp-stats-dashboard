import React, { useEffect, useState } from "react";
import { Search, Package, TrendingUp, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import fetchApi from "../services/api";
// context
import { useLoader } from "../context/LoaderContext";

export default function ValeurStockNonMouvemente() {
	const { setLoading } = useLoader();
	const [stocks, setStocks] = useState(null);
	const [valeurStockTotal, setValeurStockTotal] = useState(null);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const limit = 200;
	const [totalPages, setTotalPages] = useState(1);
	const [totalArticles, setTotalArticles] = useState(null);
	// const [totalSearchedArticles, setTotalSearchedArticles] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				const res = await fetchApi(
					`/stats/valeur-stock-non-mouvemente?page=${page}&limit=${limit}&query=${searchQuery}&sortBy=${sortBy}`
				);
				if (res.success) {
					setStocks(res.stocks);
					setValeurStockTotal(res.valeurStockTotale);
					setTotalArticles(res.totalArticles);
					// setTotalSearchedArticles(res.totalSearchedArticles);
					setTotalPages(res.totalPages);
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
	}, [page, limit, searchQuery, sortBy]);

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Package className="w-8 h-8 text-red-600" />
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
						<Package className="w-8 h-8 text-blue-600" />
					</div>
					<div className="text-gray-600">Chargement des données...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			{/* Header avec statistiques */}
			<div className="mb-8">
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
								<Package className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
									Valeur des Stocks Non Mouvementés
								</h1>
								<p className="text-gray-600 text-sm">Gestion et suivi des inventaires</p>
							</div>
						</div>

						<div className="flex items-center gap-2 text-sm text-gray-600">
							<TrendingUp className="w-4 h-4" />
							<span>{totalArticles} articles</span>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-emerald-100 text-sm font-medium">Valeur Totale</span>
								<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
									<TrendingUp className="w-4 h-4" />
								</div>
							</div>
							<div className="text-2xl font-bold">{(valeurStockTotal / 1_000_000).toFixed(2)} MDh</div>
							<div className="text-emerald-100 text-xs mt-1">{valeurStockTotal.toLocaleString()} DH</div>
						</div>

						<div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
							<div className="flex items-center justify-between mb-2">
								<span className="text-blue-100 text-sm font-medium">Articles</span>
								<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
									<Package className="w-4 h-4" />
								</div>
							</div>
							<div className="text-2xl font-bold">{totalArticles}</div>
							<div className="text-blue-100 text-xs mt-1">références en stock</div>
						</div>

						<div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white sm:col-span-2 lg:col-span-1">
							<div className="flex items-center justify-between mb-2">
								<span className="text-purple-100 text-sm font-medium">Valeur Moyenne</span>
								<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
									<TrendingUp className="w-4 h-4" />
								</div>
							</div>
							<div className="text-2xl font-bold">{(valeurStockTotal / totalArticles).toLocaleString()} DH</div>
							<div className="text-purple-100 text-xs mt-1">par article</div>
						</div>
					</div>
				</div>
			</div>

			{/* Barre de recherche et sort */}
			<div className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-2.5 mb-8">
				<div className="flex flex-col lg:flex-row gap-6 items-center">
					{/* Barre de recherche */}
					<div className="flex-1 w-full">
						<div
							className={`relative flex items-center bg-white/50 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
								isSearchFocused
									? "border-emerald-400 shadow-emerald-100"
									: "border-gray-200/50 hover:border-gray-300"
							}`}>
							<div className="flex items-center gap-3 px-5 py-4 flex-1">
								<Search
									className={`w-5 h-5 transition-colors duration-300 ${
										isSearchFocused ? "text-emerald-500" : "text-gray-400"
									}`}
								/>
								<input
									type="text"
									placeholder="Rechercher un article..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onFocus={() => setIsSearchFocused(true)}
									onBlur={() => setIsSearchFocused(false)}
									className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
								/>
							</div>
							<button
								onClick={() => {
									setSearchQuery(searchInput.trim());
									setPage(1);
								}}
								className="m-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
								Rechercher
							</button>
						</div>
					</div>

					{/* Séparateur vertical */}
					<div className="hidden lg:block w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

					{/* Sélecteur de tri */}
					<div className="relative">
						<div className="relative bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg">
							<ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
							<select
								value={sortBy}
								onChange={(e) => {
									setSortBy(e.target.value);
									setPage(1);
								}}
								className="appearance-none pl-12 pr-10 py-4 bg-transparent outline-none text-gray-700 font-medium cursor-pointer min-w-[220px] rounded-2xl">
								<option value="">Trier par défaut</option>
								<option value="price-asc">Prix croissant</option>
								<option value="price-desc">Prix décroissant</option>
								<option value="valeur-asc">Valeur croissant</option>
								<option value="valeur-desc">Valeur décroissant</option>
								<option value="stock-asc">Stock croissant</option>
								<option value="stock-desc">Stock décroissant</option>
							</select>
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tableau des stocks */}
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-xs text-nowrap">
						<thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Article</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Unité</th>
								<th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Stock</th>
								<th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">PMP</th>
								<th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Valeur</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{stocks.map((art, index) => (
								<tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 group">
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="px-2 py-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
												{art.article}
											</div>
											<div className="font-semibold text-gray-900"></div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="max-w-xs">
											<div className="text-gray-900 font-medium truncate" title={art.description}>
												{art.description}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											{art.unite}
										</span>
									</td>
									<td className="px-6 py-4 text-right">
										<div className="text-gray-900 font-semibold">{art.stockActuel}</div>
									</td>
									<td className="px-6 py-4 text-right">
										<div className="text-gray-700">{art.pmp.toLocaleString()} DH</div>
									</td>
									<td className="px-6 py-4 text-right">
										<div className="font-bold text-gray-900 text-sm">{art.valeur.toLocaleString()} DH</div>
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
					className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
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
					className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
					Suivant
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
