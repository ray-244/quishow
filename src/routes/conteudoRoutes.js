const express = require("express");
const ConteudoTeoricoController = require("../controllers/ConteudoController");
const router = express.Router();
const upload = require("../config/upload");

router.get("/", ConteudoTeoricoController.listar);
router.get("/buscar", ConteudoTeoricoController.search);
router.get("/novo", ConteudoTeoricoController.renderNovo);
router.get("/editar/:id", ConteudoTeoricoController.renderEditar);
router.post(
  "/criar",
  upload.fields([
    { name: "imagem_file", maxCount: 1 },
    { name: "video_file", maxCount: 1 },
  ]),
  ConteudoTeoricoController.create
);

router.post(
  "/:id/atualizar",
  upload.fields([
    { name: "imagem_file", maxCount: 1 },
    { name: "video_file", maxCount: 1 },
  ]),
  ConteudoTeoricoController.update
);

router.post("/:id/deletar", ConteudoTeoricoController.delete);

router.get("/:id", ConteudoTeoricoController.getById);

module.exports = router;
