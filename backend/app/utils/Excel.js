const XLSX = require("xlsx");
const path = require("path");

class Excel {
	static lireDonnees() {
		const filePath = path.join(__dirname, "../../BASE STOCK-01-09-19.xlsx");
		const workbook = XLSX.readFile(filePath);
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = XLSX.utils.sheet_to_json(sheet);
		return data;
	}
}

module.exports = Excel;
