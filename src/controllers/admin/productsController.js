const path = require("path");
const sharp = require("sharp");

const { ValidationResult } = require("express-validator");

const getAdminView = (req, res) => {
  res.render("admin");
};

const getCreateProductView = (req, res) => {
  res.render("create");
};

const createProduct = (req, res) => {
  res.send("Crear producto");
};

const getEditProductView = (req, res) => {
  res.render("edit");
};

const editProduct = (req, res) => {
  res.send(`Buscar y modificar el producto ${req.params.id}`);
  console.log(req.params, req.body);
};

const deleteProduct = (req, res) => {
  res.send(`Buscar y eliminar el producto ${req.params.id}`);
  console.log(req.params);
};

module.exports = {
  getCreateProductView,
  createProduct,
  getAdminView,
  getEditProductView,
  editProduct,
  deleteProduct,
};
