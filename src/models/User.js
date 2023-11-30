const { DataTypes } = require("sequelize");
const sequelize = require("./db.js");

const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

(async() => {await sequelize.sync()})();

module.exports = User;
