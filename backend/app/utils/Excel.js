const XLSX = require("xlsx");
const path = require("path");

let cache = null;
class Excel {
	static lireDonnees() {
		if (cache) return cache;
		const filePath = path.join(__dirname, "../../../DATABASE/STOCKS.xlsx");
		const workbook = XLSX.readFile(filePath);
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = XLSX.utils.sheet_to_json(sheet);
		cache = data;
		return data;
	}
}

module.exports = Excel;
