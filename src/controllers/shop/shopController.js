const model = require("../../models/Product");

const getShopView = async (req, res) => {
  try {
    const productos = await model.findAll();
    const idProductos = productos.map(producto => producto.id);
    const nombresProductos = productos.map(producto => producto.product_name);
    const priceProductos = productos.map(producto => producto.price);
    const skuProductos = productos.map(producto => producto.sku);
    const imgFrontProductos = productos.map(producto => producto.image_front);
    const imgBackProductos = productos.map(producto => producto.image_back);
    const duesProductos = productos.map(producto => producto.dues);
    res.render("shop", { nombresProductos, skuProductos, idProductos, imgFrontProductos, imgBackProductos, priceProductos, duesProductos});   
} catch (error) {
    console.log(error)
}
};

const getItemView = async (req, res) => {
  try {
    const producto = await model.findByPk(req.params.id);

    // ToDo: llamar a los productos por categoría (productos similares)
    const productos = await model.findAll();
    const idProductos = productos.map(producto => producto.id);
    const nombresProductos = productos.map(producto => producto.product_name);
    const priceProductos = productos.map(producto => producto.price);
    const skuProductos = productos.map(producto => producto.sku);
    const imgFrontProductos = productos.map(producto => producto.image_front);
    const imgBackProductos = productos.map(producto => producto.image_back);
    const duesProductos = productos.map(producto => producto.dues);
    res.render("item", {
      producto,
      productos,
      idProductos,
      nombresProductos,
      priceProductos,
      skuProductos,
      imgFrontProductos,
      imgBackProductos,
      duesProductos});   
  } catch (error) {
    console.log(error)
}
};

const addToCart = (req, res) => {
  res.send(`Añadir producto ${req.params.id} al carrito`);
};

const getCartView = (req, res) => {
  res.render("carro");
};

const CreatePurchase = (req, res) => {
  res.send("Confirmar compra");
};

module.exports = {
  getShopView,
  getItemView,
  addToCart,
  getCartView,
  CreatePurchase,
};
