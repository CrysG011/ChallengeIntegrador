const { DataTypes } = require("sequelize");
const sequelize = require("./db.js");

const Category = require("./Category");

const Product = sequelize.define("Product",
{
    product_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    product_description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sku: {
        type: DataTypes.STRING(9),
        allowNull: false,
    },
    dues: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    image_front: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_back: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

Product.belongsTo(Category)

module.exports = Product;
