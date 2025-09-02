import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { RotateCcw, TrendingUp, TrendingDown, BarChart3, Package, Activity, Eye } from "lucide-react";
import fetchApi from "../services/api";
import { useLoader } from "../context/LoaderContext";

export default function RotationStock() {
	const { setLoading } = useLoader();
	const chartRef = useRef(null);
	const chartInstance = useRef(null);
	const [rotationData, setRotationData] = useState({
		topRotation: [],
		lowRotation: [],
		repartitionRotation: {},
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await fetchApi("/stats/rotation-stock");
				if (response.success) {
					setRotationData(response.data);
					renderChart(response.data.repartitionRotation);
				}
			} catch (error) {
				console.error("Erreur de chargement :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const renderChart = (repartition) => {
		if (!chartRef.current) return;

		// Détruire le graphique précédent s'il existe
		if (chartInstance.current) {
			chartInstance.current.destroy();
		}

		// Créer des dégradés
		const ctx = chartRef.current.getContext("2d");

		const gradients = [
			// Rouge pour faible rotation
			(() => {
				const gradient = ctx.createLinearGradient(0, 0, 0, 400);
				gradient.addColorStop(0, "#EF4444");
				gradient.addColorStop(1, "#DC2626");
				return gradient;
			})(),
			// Orange pour moyenne
			(() => {
				const gradient = ctx.createLinearGradient(0, 0, 0, 400);
				gradient.addColorStop(0, "#F59E0B");
				gradient.addColorStop(1, "#D97706");
				return gradient;
			})(),
			// Bleu pour élevée
			(() => {
				const gradient = ctx.createLinearGradient(0, 0, 0, 400);
				gradient.addColorStop(0, "#3B82F6");
				gradient.addColorStop(1, "#1D4ED8");
				return gradient;
			})(),
			// Vert pour très élevée
			(() => {
				const gradient = ctx.createLinearGradient(0, 0, 0, 400);
				gradient.addColorStop(0, "#10B981");
				gradient.addColorStop(1, "#059669");
				return gradient;
			})(),
		];

		chartInstance.current = new Chart(chartRef.current, {
			type: "bar",
			data: {
				labels: ["< 1%", "1–3%", "3–10%", "> 10%"],
				datasets: [
					{
						label: "Nombre d'articles",
						data: [
							repartition.faible || 0,
							repartition.moyenne || 0,
							repartition.elevee || 0,
							repartition.tres_elevee || 0,
						],
						backgroundColor: gradients,
						borderRadius: 8,
						borderSkipped: false,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					title: { display: false },
					datalabels: {
						color: "#000", // couleur du texte (ex: gris foncé)
						font: {
							weight: "bold",
							size: 12,
						},
						align: "end",
						anchor: "end",
						formatter: (value) => value, // pour afficher la valeur brute
					},
				},
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							color: "rgba(107, 114, 128, 0.1)",
						},
						ticks: {
							font: { size: 12 },
							color: "#333",
						},
					},
					x: {
						grid: { display: false },
						ticks: {
							font: { size: 12, weight: "600" },
							color: "#333",
						},
					},
				},
			},
		});
	};

	// Calculer les statistiques générales
	const totalArticles = rotationData.topRotation.length + rotationData.lowRotation.length;
	const avgTopRotation =
		rotationData.topRotation.length > 0
			? rotationData.topRotation.reduce((sum, item) => sum + parseFloat(item.tauxRotation), 0) /
			  rotationData.topRotation.length
			: 0;
	const avgLowRotation =
		rotationData.lowRotation.length > 0
			? rotationData.lowRotation.reduce((sum, item) => sum + parseFloat(item.tauxRotation), 0) /
			  rotationData.lowRotation.length
			: 0;

	const TableCard = ({ title, data, icon: Icon, isTop = false }) => (
		<div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
			<div className="p-6 border-b border-gray-100">
				<div className="flex items-center gap-3">
					<div
						className={`p-3 rounded-2xl ${
							isTop ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600"
						}`}>
						<Icon className="w-6 h-6 text-white" />
					</div>
					<div>
						<h3 className="text-xl font-bold text-gray-900">{title}</h3>
						<p className="text-gray-600">
							{data.length} articles • Moyenne: {isTop ? avgTopRotation.toFixed(2) : avgLowRotation.toFixed(2)}%
						</p>
					</div>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Article
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Stock Moy.
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Conso Moy.
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Taux Rotation
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Description
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{data.map((item, index) => (
							<tr key={index} className="hover:bg-gray-50 transition-colors">
								<td className="px-4 py-3 text-sm font-medium text-gray-900">{item.article}</td>
								<td className="px-4 py-3 text-sm text-gray-600">{item.moyenneStock}</td>
								<td className="px-4 py-3 text-sm text-gray-600">{item.moyenneConso}</td>
								<td className="px-4 py-3 text-sm">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											isTop ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
										}`}>
										{parseFloat(item.tauxRotation).toFixed(2)}%
									</span>
								</td>
								<td className="px-4 py-3 text-sm text-gray-600" title={item.description}>
									<div className="max-w-xs truncate">{item.description}</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);

	return (
		<>
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
						<RotateCcw className="w-6 h-6 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900">Rotation des Stocks</h1>
				</div>
				<p className="text-gray-600 text-lg">Analyse des taux de rotation et performance des articles</p>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
							<Package className="w-6 h-6 text-white" />
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-gray-900">
								{Object.values(rotationData.repartitionRotation).reduce((a, b) => a + b, 0)}
							</div>
							<div className="text-sm text-gray-600">Total Articles</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl">
							<TrendingUp className="w-6 h-6 text-white" />
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-gray-900">{avgTopRotation.toFixed(1)}%</div>
							<div className="text-sm text-gray-600">Top Rotation</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
							<TrendingDown className="w-6 h-6 text-white" />
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-gray-900">{avgLowRotation.toFixed(1)}%</div>
							<div className="text-sm text-gray-600">Low Rotation</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl">
							<Activity className="w-6 h-6 text-white" />
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-gray-900">
								{(
									((rotationData.repartitionRotation.tres_elevee || 0) /
										Object.values(rotationData.repartitionRotation).reduce((a, b) => a + b, 0)) *
									100
								).toFixed(1)}
								%
							</div>
							<div className="text-sm text-gray-600">Haute Performance</div>
						</div>
					</div>
				</div>
			</div>

			{/* Chart Section */}
			<div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
				<div className="flex items-center gap-3 mb-6">
					<div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
						<BarChart3 className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Répartition des Taux de Rotation</h2>
						<p className="text-gray-600">Distribution des articles par catégorie de rotation</p>
					</div>
				</div>
				<div className="relative h-80">
					<canvas ref={chartRef}></canvas>
				</div>
			</div>

			{/* Tables Section */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				<TableCard title="Top 10 des Rotations" data={rotationData.topRotation} icon={TrendingUp} isTop={true} />
				<TableCard
					title="Bottom 10 des Rotations"
					data={rotationData.lowRotation}
					icon={TrendingDown}
					isTop={false}
				/>
			</div>

			{/* Insights Section */}
			<div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
				<h3 className="text-2xl font-bold text-gray-900 mb-4">Analyse & Recommandations</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="flex items-start gap-4">
						<div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
							<TrendingUp className="w-5 h-5 text-white" />
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 mb-2">Articles Performants</h4>
							<p className="text-gray-600">
								{rotationData.repartitionRotation.tres_elevee || 0} articles avec rotation > 10%
							</p>
						</div>
					</div>
					<div className="flex items-start gap-4">
						<div className="p-2 bg-red-500 rounded-lg flex-shrink-0">
							<TrendingDown className="w-5 h-5 text-white" />
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 mb-2">Articles Lents</h4>
							<p className="text-gray-600">
								{rotationData.repartitionRotation.faible || 0} articles avec rotation &lt; 1%
							</p>
						</div>
					</div>
					<div className="flex items-start gap-4">
						<div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
							<Eye className="w-5 h-5 text-white" />
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 mb-2">Action Recommandée</h4>
							<p className="text-gray-600">Optimiser les stocks des articles à faible rotation</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
