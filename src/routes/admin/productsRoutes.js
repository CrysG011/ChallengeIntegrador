const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


const { body } = require("express-validator");

const productValidations = [
    body("CategoryId")
    .custom(value => {
        if (value === "opcion1") {
            throw new Error;
        }
        return true;
    })
    .withMessage("Debes seleccionar una categoría"),
    body("product_name")
    .not()
    .isEmpty()
    .withMessage("El nombre del producto no puede estar vacío")
    .bail()
    .isLength({ min: 3 })
    .withMessage("El nombre del producto tiene que tener al menos 3 caracteres")
    .bail({ level: 'request' }),
    body("product_description")
    .not()
    .isEmpty()
    .withMessage("La descripción del producto no puede estar vacía")
    .bail({ level: 'request' }),
    body("sku")
    .isLength({min: 9, max: 9})
    .withMessage("La longitud del SKU debe ser de 9 caracteres"),
    body("price")
    .not()
    .isEmpty()
    .withMessage("El precio no puede estar vacío")
    .bail()
    .isNumeric()
    .withMessage("El precio debe ser numérico"),
    body("stock")
    .not()
    .isEmpty()
    .withMessage("El stock no puede estar vacío")
    .bail()
    .isNumeric()
    .withMessage("El stock debe ser numérico"),
]

const controller = require("../../controllers/admin/productsController.js");

router.get("/", controller.getAdminView)

router.use("/categories/", require("./categoriesRoutes.js"));

router.get("/create", controller.getCreateProductView);
router.post("/create", upload.array("imagenes"), productValidations, controller.createProduct); 

router.get("/edit/:id", controller.getEditProductView);
router.put("/edit/:id", upload.array("imagenes"), productValidations, controller.editProduct);

router.delete("/delete/:id", controller.deleteProduct);


module.exports = router 