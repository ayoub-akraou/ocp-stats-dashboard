"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		// Méthodes personnalisées ou associations si besoin
		static associate(models) {
			// associations (ex: User.hasMany(Post))
		}
	}

	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "User",
			tableName: "Users", // correspond à la table créée par la migration
		}
	);

	return User;
};
