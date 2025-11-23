const express = require("express");
const router = express.Router();
const ExperimentoController = require("../controllers/ExperimentoController");
const upload = require("../config/upload");
const Comentario = require("../models/Comentario");
const ComentarioController = require("../controllers/ComentarioController");
const CurtidaController = require("../controllers/CurtidaController");

router.get("/", ExperimentoController.listar);

router.get("/create", ExperimentoController.renderFormNew);
router.post(
  "/create",
  upload.fields([
    { name: "imagem_file", maxCount: 1 },
    { name: "video_file", maxCount: 1 },
  ]),
  ExperimentoController.create
);

router.get("/delete/:id", ExperimentoController.delete);

router.get("/editar/:id", ExperimentoController.renderFormEdit);
router.post(
  "/edit/:id",
  upload.fields([
    { name: "imagem_file", maxCount: 1 },
    { name: "video_file", maxCount: 1 },
  ]),
  ExperimentoController.update
);

router.post("/:id/curtir", CurtidaController.toggleLike);

// Detalhe do experimento
router.get("/:id", ExperimentoController.getById);

router.post("/:id/comentarios", ComentarioController.create);
router.get("/:id/comentarios/:idComment", ComentarioController.delete);
router.post("/:id/comentarios/:idComment", ComentarioController.update);

module.exports = router;
