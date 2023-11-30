const express = require("express");
const router = express.Router();
const controller = require("../../controllers/auth/authController.js");

const model = require("../../models/User")

const { body } = require("express-validator")

//estoy trabajando la parte de registro
const registerValidations = [
    body("email")
    .isEmail()
    .withMessage("Ingrese un email válido")
    .bail()
    .custom((value, { req }) => {
        return new Promise (async (resolve, reject) => {
            try {
                const user = await model.findOne({
                    where: {
                        email: value,
                    }
                });

                if (user) {
                    console.log(user);
                    return reject;
                } else {
                    return resolve();
                }
            } catch (error) {
                console.log(error)
            }
        });
    })
    .withMessage("El email ingresado ya está registrado"),
    body("password")
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("La contraseña debe tener ...")
    .bail()
    .custom((value, { req }) => value === req.body.password_confirmation)
    .withMessage("Las contraseñas no coinciden")
];

router.get("/login", controller.getLoginView);
router.post("/login", controller.verifyLogin);

router.get("/register", controller.getRegisterView);

router.post("/register", registerValidations, controller.verifyRegister);

router.get("/logout", controller.verifyLogout);

module.exports = router;