const { DataTypes } = require("sequelize");
const sequelize = require("./db.js");

const Producto = sequelize.define("products",
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

module.exports = Producto;

//dev
(async() => {await sequelize.sync()})();
