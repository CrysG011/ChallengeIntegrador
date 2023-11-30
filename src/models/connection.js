const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
    "db",
    "user",
    "pass", 
{
    host: "",
    dialect: "mysql",
}
);
module.exports = sequelize;