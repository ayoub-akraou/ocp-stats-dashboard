import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Alert from "./components/Logo/Alert";

// context
import { AlertProvider, useAlert } from "./context/AlertContext";
function AppContent() {
	const { alert } = useAlert();
	return (
		<>
			{alert && <Alert type={alert.type} message={alert.message} />}
			<Routes>
				<Route path="/login" element={<Login />} />
			</Routes>
		</>
	);
}

function App() {
	return (
		<AlertProvider>
			<Router>
				<AppContent />
			</Router>
		</AlertProvider>
	);
}

export default App;
