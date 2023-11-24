const sharp = require("sharp");
const path = require("path");
const { validationResult } = require("express-validator");

const model = require("../../models/Producto");

const getAdminView = async (get, res) => {
    try {
        const productos = await model.findAll();
        const idProductos = productos.map(producto => producto.id);
        const nombresProductos = productos.map(producto => producto.product_name);
        const skuProductos = productos.map(producto => producto.sku);
        res.render("admin", { nombresProductos, skuProductos, idProductos });   
    } catch (error) {
        console.log(error)
    }

}

const getCreateProductView = (req, res) => {
    res.render("create");
}

const createProduct = (req, res) => {

    const errors = validationResult(req)

    console.log(errors)

    if (!errors.isEmpty()) {
        return res.render("create", {
            values: req.body,
            errors: errors.array(),
        });
    }

    if (req.files.length == 2) {
        sharp(req.files[0].buffer)
        .resize(600)
        .toFile(path.resolve(__dirname, `../../../public/uploads/${req.files[0].originalname}`))
        .catch( err => console.log("Error en la imagen de frente: " + err))

        sharp(req.files[1].buffer)
        .resize(600)
        .toFile(path.resolve(__dirname, `../../../public/uploads/${req.files[1].originalname}`))
        .catch( err => console.log("Error en la imagen de dorso: " + err))
        res.send(`Creando producto...`)
        console.log(req.files.length)
    }
}

const getEditProductView = (req, res) => {
    res.render("edit");
}

const editProduct = (req, res) => {
    res.send(`Buscar y modificar el producto ${req.params.id}`);
    console.log(req.params, req.body);
}

const deleteProduct = (req, res) => {
    res.send(`Buscar y eliminar el producto ${req.params.id}`);
    console.log(req.params);
}

module.exports = {
    getCreateProductView,
    createProduct,
    getAdminView,
    getEditProductView,
    editProduct,
    deleteProduct
}; 