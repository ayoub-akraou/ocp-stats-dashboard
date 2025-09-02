export default async function fetchApi(endpoint, method = "GET", body, headers = {}, setLoading, showAlert = () => {}) {
	if (setLoading) setLoading(true);
	try {
		const response = await fetch(`http://localhost:3000/api${endpoint}`, {
			method,
			headers: {
				"Content-Type": "application/json",
				token: localStorage.getItem("token"),
				...headers,
			},
			body: method !== "GET" ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Login failed");
		}

		const data = await response.json();
		showAlert(data.message);
		return data;
	} catch (err) {
		showAlert(err.message, "danger");
		throw err.message;
	} finally {
		if (setLoading) setLoading(false);
	}
}

export async function login(username, password, setLoading, showAlert) {
	const data = await fetchApi("/login", "POST", { username, password }, {}, setLoading, showAlert);
	if (data.token) {
		localStorage.setItem("token", data.token);
	}

	if (data.user) {
		localStorage.setItem("user", JSON.stringify(data.user));
	}

	return data;
}
