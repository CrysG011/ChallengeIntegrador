const fs = require("fs/promises");
const {existsSync} = require('fs')

const sharp = require("sharp");
const path = require("path");
const { validationResult } = require("express-validator");

const model = require("../../models/Product");

const getAdminView = async (get, res) => {
    try {
        const productos = await model.findAll();
        const idProductos = productos.map(producto => producto.id);
        const nombresProductos = productos.map(producto => producto.product_name);
        const skuProductos = productos.map(producto => producto.sku);
        res.render("./admin/productos/admin", { nombresProductos, skuProductos, idProductos });   
    } catch (error) {
        console.log(error)
    }
}

const getCreateProductView = (req, res) => {
    res.render("./admin/productos/create");
}

const createProduct = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.render("./admin/productos/create", {
            values: req.body,
            errors: errors.array(),
        });
    }
    
    try {
        const product = await model.create(req.body);
        console.log(product)
    
        if (req.files.length === 2) {
            const frontImagePromise = sharp(req.files[0].buffer)
                .resize(600)
                .toFile(path.resolve(__dirname, `../../../public/uploads/${product.id}-1.webp`))
                .catch(err => console.log("Error en la imagen de frente: " + err));
    
            const boxImagePromise = sharp(req.files[1].buffer)
                .resize(600)
                .toFile(path.resolve(__dirname, `../../../public/uploads/${product.id}-box.webp`))
                .catch(err => console.log("Error en la imagen de dorso: " + err));
    
            await Promise.all([frontImagePromise, boxImagePromise]);
        }

        res.redirect("/admin/");

    } catch (error) {
        console.log("error:" + error);
        res.status(500).send(error);
    }
}    

const getEditProductView = async (req, res) => {
    try {
        const producto = await model.findByPk(req.params.id);
        if (producto) {
            res.render("./admin/productos/edit", {producto});  
        } else {
            res.status(404).send("El producto solicitado no existe");
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const editProduct = async (req, res) => {

    const errors = validationResult(req)

    console.log(errors)

    if (!errors.isEmpty()) {
        const producto = await model.findByPk(req.params.id)
        return res.render("./admin/productos/edit", {
            producto: producto,
            values: req.body,
            errors: errors.array(),
        });
    }

    try {
       const aff = await model.update(req.body, {
            where: {
                id: req.params.id,
            },
        });          
        if (aff[0] == 1){
            res.redirect("/admin/");
        } else {
            res.send("No se pudo editar el producto")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

    //acomodar mas adelante
    if (req.files[0]) {
        const frontImagePromise = sharp(req.files[0].buffer)
            .resize(600)
            .toFile(path.resolve(__dirname, `../../../public/uploads/${product.id}-1.webp`))
            .catch(err => console.log("Error en la imagen de frente: " + err));
    
        if (req.files[1]) {
                const boxImagePromise = sharp(req.files[1].buffer)
                    .resize(600)
                    .toFile(path.resolve(__dirname, `../../../public/uploads/${product.id}-box.webp`))
                    .catch(err => console.log("Error en la imagen de dorso: " + err));

                    await Promise.all([frontImagePromise, boxImagePromise]);
        }
    }
}

const deleteProduct = async (req, res) => {
    
    try {
        const deleted = await model.destroy({
            where: {
                id: req.params.id
            }
        })
        
        if (deleted == 1){
            if (existsSync(path.resolve(__dirname,`../../../public/uploads/${req.params.id}-1.webp`))){
                await fs.unlink(
                    path.resolve(
                        __dirname,`../../../public/uploads/${req.params.id}-1.webp`
                        )
                        );
                    }

            if (existsSync(path.resolve(__dirname,`../../../public/uploads/${req.params.id}-box.webp`))){
                await fs.unlink(
                    path.resolve(
                        __dirname,`../../../public/uploads/${req.params.id}-box.webp`
                        )
                        );
                    }
        }
        res.redirect("/admin/");
    } catch (error) {
        console.log(error);
    }
};
                    
module.exports = {
    getCreateProductView,
    createProduct,
    getAdminView,
    getEditProductView,
    editProduct,
    deleteProduct
}; 