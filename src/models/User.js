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
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

User.beforeSave(async (user) => {
    user.password = await bcryptjs.hash(user.password, 10);
});

module.exports = User;
