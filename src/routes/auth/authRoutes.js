const express = require("express");
const router = express.Router();
const controller = require("../../controllers/auth/authController.js");

const model = require("../../models/User")

const { body } = require("express-validator")

const registerValidations = [
    body("name")
    .not()
    .isEmpty()
    .withMessage("El nombre no puede estar vacío"),
    body("lastname")
    .not()
    .isEmpty()
    .withMessage("El apellido no puede estar vacío")
    .bail({ level: 'request' }),
    body("username")
    .not()
    .isEmpty()
    .isLength({min: 6, max: 30})
    .withMessage("Ingresa un nombre de usuario de 6 a 30 caracteres")
    .custom((value, { req }) => {
        return new Promise (async (resolve, reject) => {
            try {
                const username = await model.findOne({
                    where: {
                        username: value,
                    }
                });

                if (username) {
                    console.log("El usuario ya existe")
                    return reject();
                } else {
                    return resolve();
                }
            } catch (error) {
                console.log(error)
            }
        });
    })
    .withMessage("El usuario ingresado ya está existe"),
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
                    console.log("El email ya existe")
                    return reject();
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
    .isLength({min: 6, max: 30})
    .withMessage("La contraseña debe tener entre 6 y 30 caracteres")
    .bail()
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("La contraseña debe tener al menos una minúscula, una mayúscula, un número y un símbolo(@,!,#...)")
    .bail({ level: 'request' })
    .custom((value, { req }) => value === req.body.password_confirmation)
    .withMessage("Las contraseñas no coinciden")
];

const loginValidations = [
    body("email")
    .isEmail()
    .withMessage("Ingrese un email válido"),
    body("password")
    .isLength({min: 6, max: 30})
    .withMessage("La contraseña debe tener entre 6 y 30 caracteres")
    .bail()
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("La contraseña debe tener al menos una minúscula, una mayúscula, un número y un símbolo(@,!,#...)")
];

router.get("/login", controller.getLoginView);
router.post("/login", loginValidations, controller.verifyLogin);

router.get("/register", controller.getRegisterView);

router.post("/register", registerValidations, controller.verifyRegister);

router.get("/logout", controller.verifyLogout);

module.exports = router;