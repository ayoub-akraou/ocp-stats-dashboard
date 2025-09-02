import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Alert from "./components/Alert/Alert";

// context
import { AlertProvider, useAlert } from "./context/AlertContext";
import DashboardLayout from "./layouts/DashboardLayout";
import RuptureStats from "./pages/RuptureStats";
import RotationStock from "./pages/RotationStock";
import CouvertureStock from "./pages/CouvertureStock";
import ValeurStock from "./pages/ValeurStock";
import ValeurStockNonMouvemente from "./pages/ValeurStockNonMouvemente";
import { LoaderProvider, useLoader } from "./context/LoaderContext";
import Loader from "./components/Loader/Loader";

function AppContent() {
	const { alert } = useAlert();
	const { loading } = useLoader();

	return (
		<>
			{alert && <Alert type={alert.type} message={alert.message} />}
			{loading && <Loader />}
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<DashboardLayout />}>
					<Route index element={<Navigate to="ruptures" replace />} />
					<Route path="ruptures" element={<RuptureStats />} />
					<Route path="rotation-stock" element={<RotationStock />} />
					<Route path="couverture-stock" element={<CouvertureStock />} />
					<Route path="valeur-stock" element={<ValeurStock />} />
					<Route path="stock-non-mouvemente" element={<ValeurStockNonMouvemente />} />
				</Route>
			</Routes>
		</>
	);
}

function App() {
	return (
		<AlertProvider>
			<LoaderProvider>
				<Router>
					<AppContent />
				</Router>
			</LoaderProvider>
		</AlertProvider>
	);
}

export default App;
