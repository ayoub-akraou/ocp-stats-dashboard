import React from "react";

export default function Alert({ type = "success", message }) {
	const style =
		type === "success"
			? { color: "#016630", backgroundColor: "#f0fdf4" }
			: { color: "#9f0712", backgroundColor: "#fef2f2" };

	return (
		<div
			style={style}
			className="border-l-4 border-current animate-fade-in-right absolute top-2 right-4 max-w-xs flex items-center px-6 py-4 mb-4 text-sm rounded-lg shadow-md"
			role="alert">
			<svg
				className="shrink-0 inline w-4 h-4 me-3"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
			</svg>
			<span className="sr-only">Info</span>
			<p className="font-medium">{message || "Change a few things up and try submitting again."}</p>
		</div>
	);
}
