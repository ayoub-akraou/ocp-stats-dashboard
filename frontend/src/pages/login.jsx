import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo/Logo";

// api
import { login } from "../services/api";
import { useAlert } from "../context/AlertContext";
import { useLoader } from "../context/LoaderContext";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { setLoading } = useLoader();
	const navigate = useNavigate();

	const { showAlert } = useAlert();

	useEffect(() => {
		const isAuthenticated = Boolean(localStorage.getItem("token"));
		if (isAuthenticated) navigate("/dashboard");
	}, [navigate]);

	async function handleSubmit(e) {
		e.preventDefault();
		const success = (await login(username, password, setLoading, showAlert)).success;
		if (success) navigate("/dashboard");
	}

	return (
		<section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 relative overflow-hidden">
			{/* Fond décoratif animé */}
			<div className="absolute inset-0">
				{/* Particules décoratives */}
				<div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

				{/* Grille décorative */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(148_163_184_/_0.1)_1px,_transparent_0)] bg-[size:40px_40px]"></div>
			</div>

			{/* Contenu principal */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8">
				{/* Logo et titre */}
				<div className="mb-6 text-center">
					<div className="relative inline-block">
						<div className="w-30 h-20 bg-gradient-to-br from-emerald-500 via-cyan-600 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
							{/* Effet de brillance */}
							<div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
							<div className="relative text-white text-2xl">
								<Logo />
							</div>
						</div>
						{/* Halo lumineux */}
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 rounded-3xl blur-xl scale-110 opacity-60"></div>
					</div>
				</div>

				{/* Formulaire de connexion */}
				<div className="w-full max-w-md">
					<div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-500">
						{/* Effet de brillance sur le formulaire */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

						<div className="relative">
							<h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Connexion</h2>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Champ nom d'utilisateur */}
								<div className="space-y-2">
									<label htmlFor="username" className="block text-sm font-semibold text-slate-700">
										Nom d'utilisateur
									</label>
									<div className="relative">
										<input
											type="text"
											name="username"
											id="username"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											className="w-full px-4 py-3.5 bg-white/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:bg-white/80 backdrop-blur-sm"
											placeholder="Entrez votre nom d'utilisateur"
											required
										/>
										{/* Icône utilisateur */}
										<div className="absolute inset-y-0 right-0 flex items-center pr-3">
											<svg
												className="w-5 h-5 text-slate-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
										</div>
									</div>
								</div>

								{/* Champ mot de passe */}
								<div className="space-y-2">
									<label htmlFor="password" className="block text-sm font-semibold text-slate-700">
										Mot de passe
									</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											name="password"
											id="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="w-full px-4 py-3.5 bg-white/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:bg-white/80 backdrop-blur-sm pr-12"
											placeholder="••••••••"
											required
										/>
										{/* Bouton afficher/masquer le mot de passe */}
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors duration-200">
											{showPassword ? (
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
													/>
												</svg>
											) : (
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
											)}
										</button>
									</div>
								</div>

								{/* Bouton de connexion */}
								<button
									type="submit"
									className="group relative w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-cyan-600 to-teal-500   text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
									{/* Effet de brillance */}
									<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

									{/* Contenu du bouton */}
									<div className="relative flex items-center justify-center">
										<span className="mr-2">Se connecter</span>
										<svg
											className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
									</div>

									{/* Effet de vague */}
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
								</button>
							</form>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="text-sm text-slate-500">© 2025 Dashboard. Tous droits réservés.</p>
				</div>
			</div>
		</section>
	);
}
