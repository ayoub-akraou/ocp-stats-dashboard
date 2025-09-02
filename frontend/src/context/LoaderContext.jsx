import React, { createContext, useContext, useState } from "react";

// Création du contexte avec une valeur par défaut plus complète
const LoaderContext = createContext({
	loading: false,
	setLoading: (value) => {}, // valeur par défaut vide
});

// Provider du contexte
export function LoaderProvider({ children }) {
	const [loading, setLoading] = useState(false);

	// Fonction personnalisée avec délai d'activation uniquement pour le "true"
	function delayedSetLoading(value) {
		if (!value) {
			setTimeout(() => setLoading(false), 600);
		} else {
			setLoading(true);
		}
	}

	return (
		<LoaderContext.Provider value={{ loading, setLoading: delayedSetLoading }}>{children}</LoaderContext.Provider>
	);
}

// Hook personnalisé pour utiliser le contexte
export function useLoader() {
	return useContext(LoaderContext);
}
