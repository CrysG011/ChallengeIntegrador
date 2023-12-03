const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { body } = require("express-validator");

const categoryValidations = [
    body("category_name")
    .not()
    .isEmpty()
    .withMessage("Ni el nombre ni la descripción pueden estar vacías.")
    .bail( {level: 'request'} ),
    body("category_description")
    .not()
    .isEmpty()
    .withMessage("Ni el nombre ni la descripción pueden estar vacías."),
]

const controller = require("../../controllers/admin/categoriesController.js");

router.get("/", controller.getAdminCategoryView)

router.get("/create", controller.getCreateCategoryView);
router.post("/create", upload.single("imagen"), categoryValidations, controller.createCategory); 

router.get("/edit/:id", controller.getEditCategoryView);
router.put("/edit/:id", upload.single("imagen"), categoryValidations, controller.editCategory);

router.delete("/delete/:id", controller.deleteCategory);


module.exports = router 