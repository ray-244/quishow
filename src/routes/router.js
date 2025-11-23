const express = require('express');
const router = express.Router();

const authRoutes = require("./authRoutes");
const experimentoRoutes = require("./experimentoRoutes");
const conteudosRoutes = require("./conteudoRoutes");

router.use("/auth", authRoutes);
router.use("/experimentos", experimentoRoutes);
router.use("/conteudos", conteudosRoutes);

module.exports = router;