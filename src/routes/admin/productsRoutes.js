const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


const { body } = require("express-validator");

const validations = [
    body("nombre")
    .not()
    .isEmpty()
    .withMessage("El nombre del producto no puede estar vacío")
    .bail()
    .isLength({ min: 3 })
    .withMessage("El nombre del producto tiene que tener al menos 3 caracteres")
    .bail(),
    body("precio")
    .not()
    .isEmpty()
    .withMessage("El precio no puede estar vacío")
    .bail()
    .isNumeric()
    .withMessage("El precio debe ser numérico")
    .bail(),
    body("stock")
    .isNumeric()
    .withMessage("El stock debe ser numérico")
    .bail(),
    body("descripcion")
    .not()
    .isEmpty()
    .withMessage("La descripción del producto no puede estar vacía")
    .bail(),
    body("sku")
    .not()
    .isEmpty()
    .withMessage("El SKU no puede estar vacío")
    .isLength({min: 9, max: 9})
    .withMessage("La longitud del SKU debe ser de 9 caracteres")
]

const sharp = require("sharp");

const controller = require("../../controllers/admin/productsController.js");
router.get("/", controller.getAdminView)

router.get("/create", controller.getCreateProductView);
router.post("/create", upload.array("imagenes"), validations, controller.createProduct); 

router.get("/edit/:id", controller.getEditProductView);

router.put("/edit/:id", controller.editProduct);

router.delete("/delete/:id", controller.deleteProduct);


module.exports = router 