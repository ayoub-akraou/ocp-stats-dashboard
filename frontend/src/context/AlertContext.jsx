import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext({ alert: null });
export function AlertProvider({ children }) {
	const [alert, setAlert] = useState();

	function showAlert(message, type = "success") {
		setAlert({ message, type });
		setTimeout(() => setAlert(null), 3000);
	}

	return <AlertContext.Provider value={{ alert, showAlert }}>{children}</AlertContext.Provider>;
}

export function useAlert() {
	return useContext(AlertContext);
}
