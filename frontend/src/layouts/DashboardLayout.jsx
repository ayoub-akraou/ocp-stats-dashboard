import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/Logo/Logo.jsx";

export default function DashboardLayout() {
	const navigate = useNavigate();

	useEffect(() => {
		const isAuthenticated = Boolean(localStorage.getItem("token"));
		if (!isAuthenticated) navigate("/login");
	});

	const [isCollapsed, setIsCollapsed] = useState(false);

	// Navigation items avec icônes et informations
	const navItems = [
		{
			to: "ruptures",
			label: "Taux de Ruptures",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			),
			color: "from-red-500 to-pink-500",
			bgColor: "bg-red-300 [&_svg]:text-red-500 [&_svg]:text-red-600 hover:bg-red-400 border-red-500 border-2",
		},
		{
			to: "rotation-stock",
			label: "Rotation de Stock",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			),
			color: "from-blue-500 to-cyan-500",
			bgColor: "bg-blue-300 [&_svg]:text-blue-500 [&_svg]:text-blue-600 hover:bg-blue-400 border-blue-500 border-2",
		},
		{
			to: "couverture-stock",
			label: "Couverture de Stock",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			),
			color: "from-green-500 to-emerald-500",
			bgColor:
				"bg-green-300 [&_svg]:text-green-500 [&_svg]:text-green-600 hover:bg-green-400 border-green-500 border-2",
		},
		{
			to: "valeur-stock",
			label: "Valeur du Stock",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
			color: "from-yellow-500 to-orange-500",
			bgColor:
				"bg-yellow-300 [&_svg]:text-yellow-500 [&_svg]:text-yellow-600 hover:bg-yellow-400 border-yellow-500 border-2",
		},
		{
			to: "stock-non-mouvemente",
			label: "Stock Non-Mouvementé",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
					/>
				</svg>
			),
			color: "from-purple-500 to-indigo-500",
			bgColor:
				"bg-purple-300 [&_svg]:text-purple-500 [&_svg]:text-purple-600 hover:bg-purple-400 border-purple-500 border-2",
		},
	];

	// Style pour les liens de navigation
	function navLinkStyle({ isActive }, item) {
		const baseClass = `
			relative flex justify-center items-center rounded-xl px-4 py-3 mb-2 transition-all duration-300 font-medium text-sm
			hover:scale-105 hover:shadow-lg transform group
		`;

		if (isActive) {
			return `${baseClass} bg-gradient-to-r ${item.color} text-white shadow-lg`;
		}

		return `${baseClass} text-gray-600 hover:text-gray-900 ${item.bgColor} shadow-sm hover:shadow-md`;
	}

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<nav
				className={`
				${isCollapsed ? "w-28" : "w-72"} 
				bg-white shadow-2xl transition-all duration-300 ease-in-out
				border-r border-gray-200 relative
			`}>
				{/* Header avec logo */}
				<div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-100">
					<div className="flex items-center justify-between">
						<div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
							<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<Logo />
							</div>
							{!isCollapsed && (
								<div>
									<h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
									<p className="text-xs text-gray-500">Gestion des stocks</p>
								</div>
							)}
						</div>

						{/* Bouton collapse */}
						<button
							onClick={() => setIsCollapsed(!isCollapsed)}
							className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
							<svg
								className={`w-5 h-5 text-gray-600 transform transition-transform ${
									isCollapsed ? "rotate-180" : ""
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Navigation Items */}
				<div className="p-4 space-y-2">
					{!isCollapsed && (
						<div className="mb-6">
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Indicateurs</h3>
						</div>
					)}

					{navItems.map((item, index) => (
						<NavLink key={index} to={item.to} className={({ isActive }) => navLinkStyle({ isActive }, item)}>
							{({ isActive }) => (
								<>
									<div className={`flex-1 flex items-center ${isCollapsed ? "justify-center" : ""} gap-4`}>
										{/* Icône avec effet de gradient */}
										<div
											className={`
										flex items-center justify-center w-10 h-10 rounded-lg
										${isActive ? "bg-white/20" : "bg-white/40 shadow-sm group-hover:shadow-md"}
										transition-all duration-300
									`}>
											<div
												className={`
											${
												isActive
													? "text-white"
													: `group-hover:bg-gradient-to-r group-hover:${item.color} group-hover:bg-clip-text group-hover:text-current`
											}
										`}>
												{item.icon}
											</div>
										</div>

										{/* Label */}
										{!isCollapsed && (
											<span
												className={`ml-3 font-medium text-nowrap ${
													isActive ? "text-white" : "text-gray-700 group-hover:text-gray-900"
												}`}>
												{item.label}
											</span>
										)}
									</div>
									{/* Indicateur actif ou hover */}
									{!isCollapsed && (
										<div
											className={` transition-all duration-300 ${
												isActive
													? "w-2 h-2 bg-white rounded-full opacity-80"
													: "w-1 h-1 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-2 group-hover:h-2"
											}`}></div>
									)}
								</>
							)}
						</NavLink>
					))}
				</div>

				{/* Footer du sidebar */}
				{!isCollapsed && (
					<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
						<div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
									<span className="text-white text-sm font-semibold">JD</span>
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900">John Doe</p>
									<p className="text-xs text-gray-500">Admin</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</nav>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Header du contenu principal */}
				<header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
							<p className="text-gray-600">Suivi des performances de stock</p>
						</div>
					</div>
				</header>

				{/* Contenu principal */}
				<main className="flex-1 p-8 bg-gray-50 overflow-auto">
					<div className=" container mx-auto">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
