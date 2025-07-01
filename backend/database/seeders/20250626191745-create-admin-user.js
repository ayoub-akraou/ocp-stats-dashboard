const bcrypt = require("bcrypt");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const hashedPassword = await bcrypt.hash("admin", 10);
		return queryInterface.bulkInsert("Users", [
			{
				username: "admin",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Users", { username: "admin" }, {});
	},
};
