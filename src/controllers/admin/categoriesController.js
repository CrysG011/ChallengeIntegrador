const { validationResult } = require("express-validator");

const model = require("../../models/Category");

const getAdminCategoryView = async (get, res) => {
    try {
        const category = await model.findAll();
        const idCategorias = category.map(category => category.id);
        const nombresCategorias = category.map(category => category.category_name);
        res.render("./admin/categorias/admin", { nombresCategorias, idCategorias });   
    } catch (error) {
        console.log(error)
    }
}

const getCreateCategoryView = (req, res) => {
    res.render("./admin/categorias/create");
}

const createCategory = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.render("./admin/categorias/create", {
            values: req.body,
            errors: errors.array(),
        });
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
            res.redirect("/admin/");
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
        res.redirect("/admin/");
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