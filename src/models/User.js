const { DataTypes } = require("sequelize");
const sequelize = require("./db.js");

const bcryptjs = require("bcryptjs");

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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

User.beforeSave(async (user, options) => {
    const { password } = user;

    const hash = await bcryptjs.hash(password, 10);

    user.password = hash;
});

(async() => {await sequelize.sync()})();

module.exports = User;
