require("dotenv").config()

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const sequelize = require("./src/models/db.js");

const model = require("./src/models/User")

// Dejo express-session pero si queres usamos cookie-session
const session = require("cookies-session");
app.use(session({
  secret: process.env.SESSION_HASH,
  resave: false,
  saveUninitialized: false,
  })
);

const isLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("auth/login");
  }

  next();
};

const isAdmin = async (req, res, next) => {
  //funca bien pero hay algun problemilla que si perdes la session mientras estas en /admin y luego tocas
  //el lapiz de editar te redirige muchas veces a auth y te salta un error (no creashea) jijiji
  try {
    const user = await model.findOne({
      where: {
         id: req.session.userId,
      }
    });

    if (user) {
      user.admin == true ? next() : res.send("No tienes permisos para acceder a esta página");
    }
  }
   catch (error) {
    res.send(error)
    console.log(error)
  }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

app.use(require("./src/routes/mainRoutes.js"));

app.use("/admin/", isLogin, isAdmin, require("./src/routes/admin/productsRoutes.js"));

app.use("/shop", require("./src/routes/shop/shopRoutes.js"));

app.use("/auth", require("./src/routes/auth/authRoutes.js"));

app.use((req, res, next) => {
  res.status(404).send("La página no existe");
});

const PORT = process.env.PORT || 3000;
app.listen (PORT, async () => {
try {
  await sequelize.sync({ alter: true });
} catch (error) {
  console.log(error)
}
console.log(`http://localhost:${PORT}`);
} );
