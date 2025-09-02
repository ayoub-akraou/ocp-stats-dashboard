import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, PieChart } from "lucide-react";

Chart.register(ChartDataLabels);
import fetchApi from "../services/api";
import { useLoader } from "../context/LoaderContext";

export default function RuptureStats() {
	const { setLoading } = useLoader();
	const [statsData, setStatsData] = useState(null);

	const pieChartRef = useRef(null);
	const lineChartRef = useRef(null);
	const pieChartInstance = useRef(null);
	const lineChartInstance = useRef(null);

	useEffect(() => {
		const drawChart = async () => {
			try {
				setLoading(true);
				const dataFromApi = await fetchApi("/stats/ruptures");
				setStatsData(dataFromApi);

				// ⚠️ Exemple : dataFromApi.tauxRupture = "12.34"
				const taux = parseFloat(dataFromApi.tauxRupture.at(-1));

				if (isNaN(taux)) return;

				// === PIE CHART ===
				// Créer des dégradés Canvas
				const ctx = pieChartRef.current.getContext("2d");

				// Dégradé vert pour "Disponibles"
				const greenGradient = ctx.createLinearGradient(0, 0, 0, 400);
				greenGradient.addColorStop(0, "#10B981");
				greenGradient.addColorStop(1, "#059669");

				// Dégradé rouge pour "Ruptures"
				const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
				redGradient.addColorStop(0, "#EF4444");
				redGradient.addColorStop(1, "#DC2626");

				const pieData = {
					labels: ["Disponibles", "Ruptures"],
					datasets: [
						{
							label: "Taux de rupture",
							data: [100 - taux, taux],
							backgroundColor: [greenGradient, redGradient],
							borderWidth: 3,
							borderColor: "#ffffff",
							hoverOffset: 8,
							hoverBorderWidth: 4,
						},
					],
				};

				if (pieChartInstance.current) pieChartInstance.current.destroy();

				pieChartInstance.current = new Chart(pieChartRef.current, {
					type: "doughnut",
					data: pieData,
					options: {
						responsive: true,
						maintainAspectRatio: false,
						cutout: "65%",
						plugins: {
							legend: {
								position: "bottom",
								labels: {
									padding: 20,
									usePointStyle: true,
									font: { size: 14, weight: "600" },
								},
							},
							datalabels: {
								color: "#fff",
								formatter: (value, context) => {
									const total = context.chart._metasets[0].total;
									return ((value / total) * 100).toFixed(1) + "%";
								},
								font: { weight: 600, size: 14 },
							},
						},
					},
					plugins: [ChartDataLabels],
				});

				// === LINE CHART ===
				const anneeActuelle = new Date().getFullYear();
				const annees = Array.from({ length: 5 }, (_, i) => anneeActuelle - (4 - i));

				const tauxParAnnee = dataFromApi.tauxRupture; // en pourcentage

				const lineData = {
					labels: annees,
					datasets: [
						{
							label: "Taux de rupture (%)",
							data: tauxParAnnee,
							fill: true,
							backgroundColor: "rgba(99, 102, 241, 0.1)",
							borderColor: "rgb(99, 102, 241)",
							borderWidth: 3,
							tension: 0.4,
							pointBackgroundColor: "rgb(99, 102, 241)",
							pointBorderColor: "#fff",
							pointBorderWidth: 3,
							pointRadius: 6,
							pointHoverRadius: 8,
						},
					],
				};

				if (lineChartInstance.current) lineChartInstance.current.destroy();

				lineChartInstance.current = new Chart(lineChartRef.current, {
					type: "line",
					data: lineData,
					options: {
						responsive: true,
						maintainAspectRatio: false,
						scales: {
							y: {
								beginAtZero: false,
								min: Math.floor(Math.min(...tauxParAnnee) - 1),
								max: Math.ceil(Math.max(...tauxParAnnee) + 1),
								ticks: {
									callback: (val) => val.toFixed(1) + "%",
									font: { size: 12 },
									color: "#6B7280",
								},
								grid: {
									color: "rgba(107, 114, 128, 0.1)",
								},
							},
							x: {
								ticks: {
									font: { size: 12 },
									color: "#6B7280",
								},
								grid: {
									display: false,
								},
							},
						},
						plugins: {
							legend: {
								display: false,
							},
							datalabels: {
								align: "top",
								anchor: "end",
								color: "#4F46E5",
								font: {
									weight: "bold",
									size: 12,
								},
								formatter: function (value) {
									return value + "%";
								},
							},
						},
					},
				});
			} catch (err) {
				console.error("Erreur de chargement des stats :", err);
			} finally {
				setLoading(false);
			}
		};

		drawChart();
	}, []);

	const currentRate = statsData ? parseFloat(statsData.tauxRupture.at(-1)) : 0;
	const previousRate = statsData ? parseFloat(statsData.tauxRupture.at(-2)) : 0;
	const rateChange = currentRate - previousRate;

	return (
		<div className="max-w-7xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Statistiques de Rupture</h1>
				<p className="text-gray-600 text-lg">Analyse des taux de rupture et tendances de stock</p>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
							<AlertTriangle className="w-6 h-6 text-white" />
						</div>
						<div
							className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
								rateChange > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
							}`}>
							{rateChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
							{Math.abs(rateChange).toFixed(2)}%
						</div>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-1">{currentRate.toFixed(1)}%</h3>
					<p className="text-gray-600">Taux de rupture actuel</p>
				</div>

				<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl">
							<CheckCircle className="w-6 h-6 text-white" />
						</div>
						<div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">Stock</div>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-1">{(100 - currentRate).toFixed(1)}%</h3>
					<p className="text-gray-600">Produits disponibles</p>
				</div>

				<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
							<BarChart3 className="w-6 h-6 text-white" />
						</div>
						<div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">Analyse</div>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-1">
						{statsData ? statsData.tauxRupture.length : 0} Années
					</h3>
					<p className="text-gray-600">Périodes analysées</p>
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				{/* Pie Chart */}
				<div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
							<PieChart className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Répartition Stock</h2>
							<p className="text-gray-600">Distribution actuelle des produits</p>
						</div>
					</div>
					<div className="relative h-80">
						<canvas ref={pieChartRef}></canvas>
					</div>
				</div>

				{/* Line Chart */}
				<div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
							<TrendingUp className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Évolution Temporelle</h2>
							<p className="text-gray-600">Tendance des ruptures sur 5 ans</p>
						</div>
					</div>
					<div className="relative h-80">
						<canvas ref={lineChartRef}></canvas>
					</div>
				</div>
			</div>

			{/* Insights Section */}
			<div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
				<h3 className="text-2xl font-bold text-gray-900 mb-4">Insights & Recommandations</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex items-start gap-4">
						<div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
							<TrendingUp className="w-5 h-5 text-white" />
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 mb-2">Tendance Actuelle</h4>
							<p className="text-gray-600">
								{rateChange > 0
									? "Le taux de rupture est en hausse. Surveillez les stocks critiques."
									: "Le taux de rupture diminue. Bonne gestion des stocks."}
							</p>
						</div>
					</div>
					<div className="flex items-start gap-4">
						<div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
							<CheckCircle className="w-5 h-5 text-white" />
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 mb-2">Action Recommandée</h4>
							<p className="text-gray-600">
								{currentRate > 10
									? "Taux élevé : Réapprovisionner les produits en rupture."
									: "Taux acceptable : Maintenir la surveillance des stocks."}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
