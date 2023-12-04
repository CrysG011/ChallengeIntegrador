const { DataTypes } = require("sequelize");
const sequelize = require("./db.js");

const Category = sequelize.define("Category",
{
    category_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Category;

//dev
(async() => {await sequelize.sync()})();
