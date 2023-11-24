const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "lautarom_funkoshop",
    "lautarom_2",
    "lautarom2@",
     {
        host: "mysql-lautarom.alwaysdata.net",
        dialect: "mysql",
     } 
);

module.exports = sequelize;

