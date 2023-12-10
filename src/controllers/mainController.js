const model = require("../models/Product");
const modelCategory = require("../models/Category");

const index = async (req, res) => {

  const categorias = await modelCategory.findAll()

  const productosRecientes = await model.findAll({
    order: [['createdAt', 'DESC']],
    limit: 12
  });

  res.render("layouts/layout", {productosRecientes, categorias});
};

module.exports = {
  index,
};
