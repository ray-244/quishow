const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");


// Renderizar formulário de cadastro
router.get("/cadastro", UsuarioController.renderCadastro);

// Processar cadastro
router.post("/cadastro", UsuarioController.register);

// Renderizar formulário de login
router.get("/entrar", UsuarioController.renderLogin);

// Processar login
router.post("/entrar", UsuarioController.login);

// Logout
router.get("/sair", UsuarioController.sair);


// Renderizar perfil do usuário (via sessão)
router.get("/perfil", UsuarioController.renderPerfil);

// Atualizar perfil do usuário (via sessão)
router.post("/perfil", UsuarioController.updateProfileSession);

module.exports = router;
