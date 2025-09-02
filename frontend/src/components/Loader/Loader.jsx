import React from "react";
import Logo from "../Logo/Logo";

export default function Loader() {
	return (
		<div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gradient-to-br from-slate-50/95 via-blue-50/95 to-purple-100/95 backdrop-blur-sm flex items-center justify-center">
			{/* Fond décoratif */}
			<div className="absolute inset-0">
				{/* Particules décoratives */}
				<div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
			</div>

			{/* Contenu du loader */}
			<div className="relative flex flex-col items-center justify-center">
				{/* Loader principal avec effet glassmorphique */}
				<div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
					{/* Effet de brillance */}
					<div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>

					{/* Animation de loader modernisée */}
					<div className="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 100 100"
							preserveAspectRatio="xMidYMid"
							width="80"
							height="80"
							style={{ shapeRendering: "auto", display: "block" }}
							xmlnsXlink="http://www.w3.org/1999/xlink">
							<g>
								{/* Premier cercle - dégradé bleu à violet */}
								<circle strokeWidth="3" stroke="url(#grad1)" fill="none" r="0" cy="50" cx="50">
									<animate
										begin="0s"
										calcMode="spline"
										keySplines="0 0.2 0.8 1"
										keyTimes="0;1"
										values="0;35"
										dur="1.5s"
										repeatCount="indefinite"
										attributeName="r"></animate>
									<animate
										begin="0s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										keyTimes="0;1"
										values="1;0"
										dur="1.5s"
										repeatCount="indefinite"
										attributeName="opacity"></animate>
								</circle>

								{/* Deuxième cercle - dégradé violet à rose */}
								<circle strokeWidth="3" stroke="url(#grad2)" fill="none" r="0" cy="50" cx="50">
									<animate
										begin="-0.5s"
										calcMode="spline"
										keySplines="0 0.2 0.8 1"
										keyTimes="0;1"
										values="0;35"
										dur="1.5s"
										repeatCount="indefinite"
										attributeName="r"></animate>
									<animate
										begin="-0.5s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										keyTimes="0;1"
										values="1;0"
										dur="1.5s"
										repeatCount="indefinite"
										attributeName="opacity"></animate>
								</circle>

								{/* Troisième cercle - dégradé rose à cyan */}
								<circle strokeWidth="3" stroke="url(#grad3)" fill="none" r="0" cy="50" cx="50">
									<animate
										begin="-1s"
										calcMode="spline"
										keySplines="0 0.2 0.8 1"
										keyTimes="0;1"
										values="0;35"
										dur="1.5s"
										repeatCount="indefinite"
										attributeName="r"></animate>
									<animate
										begin="-1s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										keyTimes="0;1"
										values="1;0"
										dur="1.5s"
										repeatCount="indefinite"
										attributeName="opacity"></animate>
								</circle>

								{/* Définition des dégradés */}
								<defs>
									<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
										<stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
										<stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
									</linearGradient>
									<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
										<stop offset="0%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
										<stop offset="100%" style={{ stopColor: "#ec4899", stopOpacity: 1 }} />
									</linearGradient>
									<linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
										<stop offset="0%" style={{ stopColor: "#ec4899", stopOpacity: 1 }} />
										<stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
									</linearGradient>
								</defs>
							</g>
						</svg>
					</div>
				</div>

				{/* Texte et logo */}
				<div className="mt-6 text-center">
					{/* Logo avec effet de pulsation */}
					<div className="inline-block mb-4">
						<div className="w-30 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
							<div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
							<div className="relative text-white text-xl font-bold">
								{/* Ici vous pouvez intégrer votre Logo component */}
								<Logo />
							</div>
						</div>
					</div>

					{/* Texte de chargement */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
							Chargement en cours...
						</h3>
						<p className="text-sm text-slate-600">Préparation de votre tableau de bord</p>
					</div>

					{/* Barre de progression animée */}
					<div className="mt-4 w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
						<div className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full animate-pulse">
							<div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
						</div>
					</div>
				</div>

				{/* Points de chargement animés */}
				<div className="flex space-x-2 mt-4">
					<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
					<div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
					<div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
				</div>
			</div>

			{/* Particules flottantes */}
			<div className="absolute top-20 left-20 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
			<div className="absolute top-32 right-32 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
			<div className="absolute bottom-32 left-32 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-50 animation-delay-2000"></div>
			<div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-60 animation-delay-3000"></div>

			{/* Styles CSS personnalisés intégrés */}
			<style jsx>{`
				@keyframes shimmer {
					0% {
						transform: translateX(-100%) skewX(-12deg);
					}
					100% {
						transform: translateX(200%) skewX(-12deg);
					}
				}
				.animate-shimmer {
					animation: shimmer 2s infinite;
				}
				.animation-delay-200 {
					animation-delay: 200ms;
				}
				.animation-delay-400 {
					animation-delay: 400ms;
				}
				.animation-delay-1000 {
					animation-delay: 1000ms;
				}
				.animation-delay-2000 {
					animation-delay: 2000ms;
				}
				.animation-delay-3000 {
					animation-delay: 3000ms;
				}
			`}</style>
		</div>
	);
}
