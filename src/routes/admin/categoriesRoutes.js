const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const validations = [
    body("product_name")
    .not()
    .isEmpty()
    .withMessage("El nombre de la categoría no puede estar vacío")
]

const controller = require("../../controllers/admin/categoriesController.js");

router.get("/", controller.getAdminCategoryView)

router.get("/create", controller.getCreateCategoryView);
router.post("/create", validations, controller.createCategory); 

router.get("/edit/:id", controller.getEditCategoryView);
router.put("/edit/:id", validations, controller.editCategory);

router.delete("/delete/:id", controller.deleteCategory);


module.exports = router 