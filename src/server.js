const express = require("express");
const path = require("path");
const cors = require("cors");
const handlebars = require("express-handlebars");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");

const PORT = process.env.PORT || 3000;
const routes = require("./routes/router");

const server = express();

server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname, "./public")));
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.engine(
  "hbs",
  handlebars.engine({ defaultLayout: "main", extname: ".hbs" })
);
server.set("view engine", "hbs");
server.set("views", path.join(__dirname, "views"));

server.use(
  session({
    secret: process.env.SESSION_SECRET || "papito123dnoeinda",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
    cookie: {
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    },
  })
);

server.use(flash());

server.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.user = req.session.user || null;
  next();
});

server.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    year: new Date().getFullYear(),
    user: req.session.user || null,
  });
});

// Router
server.use("/", routes);

// Configurando PORT
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
