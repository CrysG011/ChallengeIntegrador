const fs = require("fs/promises");
const {existsSync} = require('fs')

const { validationResult } = require("express-validator");

const model = require("../../models/Category");
const sharp = require("sharp");
const path = require("path");

const getAdminCategoryView = async (get, res) => {
    try {
        const category = await model.findAll();
        const idCategorias = category.map(category => category.id);
        const nombresCategorias = category.map(category => category.category_name);
        const descripcionCategorias = category.map(category => category.category_description);
        res.render("./admin/categorias/admin", { nombresCategorias, idCategorias, descripcionCategorias });   
    } catch (error) {
        console.log(error)
        res.status(500).send("Error interno del servidor");
    }
}

const getCreateCategoryView = (req, res) => {
    res.render("./admin/categorias/create");
}

const createCategory = async (req, res) => {

    const errors = validationResult(req)
    console.log("el req body es: ", req.body);

    if (!errors.isEmpty()) {
        return res.render("./admin/categorias/create", {
            values: req.body,
            errors: errors.array(),
        });
    }
    
    try {
        const category = await model.create(req.body);
        console.log(category)
    
        if (req.file) {
            await sharp(req.file.buffer)
                .resize(600)
                .toFile(path.resolve(__dirname, `../../../public/uploads/categories/${category.id}.webp`))
                .catch(err => console.log("Error en la imagen: " + err));
        }

        res.redirect("/admin/categories/");

    } catch (error) {
        console.log("error:" + error);
        res.status(500).send(error);
    }
}    

const getEditCategoryView = async (req, res) => {
    try {
        const category = await model.findByPk(req.params.id);
        if (category) {
            res.render("./admin/categorias/edit", {category});  
        } else {
            res.status(404).send("El producto solicitado no existe");
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const editCategory = async (req, res) => {

    const errors = validationResult(req)

    console.log(errors)

    if (!errors.isEmpty()) {
        const categoria = await model.findByPk(req.params.id)
        return res.render("./admin/categorias/edit", {
            categoria: categoria,
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
            res.redirect("/admin/categories");
        } else {
            res.send("No se pudo editar el producto")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const deleted = await model.destroy({
            where: {
                id: req.params.id
            }
        })

        if (deleted == 1){
            if (existsSync(path.resolve(__dirname,`../../../public/uploads/categories/${req.params.id}.webp`))){
                await fs.unlink(
                    path.resolve(
                        __dirname,`../../../public/uploads/categories/${req.params.id}.webp`
                        )
                        );
                    }
        }

        res.redirect("/admin/categories/");
    } catch (error) {
        console.log(error);
    }
};
                    
module.exports = {
    getCreateCategoryView,
    createCategory,
    getAdminCategoryView,
    getEditCategoryView,
    editCategory,
    deleteCategory
}; 