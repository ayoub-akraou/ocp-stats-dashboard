export function format(tauxCouvertureMensuelle = 100 /* 100% signifie un mois de couverture*/) {
	let days = (tauxCouvertureMensuelle * 30) / 100;
	let months = 0;
	let years = 0;
	if (days / 30 >= 1) {
		months = parseInt(days / 30);
		days = days % 30;
	}
	if (months / 12 >= 1) {
		years = parseInt(months / 12);
		months = months % 12;
	}
	return `${years ? years + "A" : ""} ${months ? months + "M" : ""} ${days ? Math.floor(days) + "J" : ""}`;
}
