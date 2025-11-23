const Experiment = require("../models/Experimento");
const Comentario = require("../models/Comentario");
const Curtida = require("../models/Curtida");
const UploadHelper = require("../utils/uploadHelper");

class ExperimentoController {
  // Listar experimentos
  static async listar(req, res) {
    try {
      const lista = await Experiment.findAll();
      const experimentos = await Promise.all(
        lista.map(async (e) => {
          const curtidas = await Curtida.countLikes(e.id);
          const comentarios = (await Comentario.findByExperiment(e.id)).length;
          return {
            id: e.id,
            titulo: e.title || e.titulo,
            descricao: e.description || e.descricao,
            imagem: e.image || e.imagem || null,
            video: e.video || e.video || null,
            curtidas,
            comentarios,
          };
        })
      );

      if (req.accepts("html"))
        return res.render("experimentos/lista", {
          title: "Experimentos",
          experimentos,
          user: req.session.user,
          isAdmin: req.session.user?.role === "admin",
          year: new Date().getFullYear(),
        });

      res.json(experimentos);
    } catch (error) {
      console.error(error);
      if (req.accepts("html")) {
        req.flash("error_msg", "Erro ao carregar experimentos");
        return res.redirect("/");
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Renderizar formulário novo
  static renderFormNew(req, res) {
    console.log("Renderizando formulário de novo experimento");
    res.render("experimentos/form", {
      title: "Novo Experimento",
      user: req.session.user,
      year: new Date().getFullYear(),
    });
  }

  // Renderizar formulário de edição
  static async renderFormEdit(req, res) {
    try {
      console.log("Renderizando formulário de edição de experimento");
      const e = await Experiment.findById(req.params.id);
      if (!e)
        return (
          req.flash("error_msg", "Experimento não encontrado"),
          res.redirect("/experimentos")
        );

      const experimento = {
        id: e.id,
        titulo: e.title || e.titulo,
        descricao: e.description || e.descricao,
        materiais: ExperimentoController._toArray(e.materials),
        passos: ExperimentoController._toArray(e.steps),
        medidas_seguranca: ExperimentoController._toArray(e.safety_measures),
        imagem: e.image || e.imagem || "",
        video: e.video || e.video || "",
      };

      res.render("experimentos/form", {
        title: "Editar Experimento",
        experimento,
        user: req.session.user,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Erro ao carregar experimento");
      res.redirect("/experimentos");
    }
  }

  // Criar experimento
  static async create(req, res) {
    console.log("Criando novo experimento");
    try {
      const admin_id = req.user?.id || req.session.user?.id;
      if ((req.user?.role || req.session.user?.role) !== "admin") {
        req.flash(
          "error_msg",
          "Apenas administradores podem criar experimentos"
        );
        return res.redirect("/experimentos");
      }

      const title = req.body.title || req.body.titulo;
      const description = req.body.description || req.body.descricao;
      const materials = req.body.materials || req.body.materiais;
      const steps = req.body.steps || req.body.passos;
      const safety_measures =
        req.body.safety_measures || req.body.medidas_seguranca;

      if (!title || !description) {
        req.flash("error_msg", "Título e descrição são obrigatórios");
        return res.redirect("/experimentos/novo");
      }

      console.log("Processando upload de arquivos...");

      const image =
        UploadHelper.getUploadUrlFromField(req.files, "imagem_file") ||
        req.body.imagem ||
        null;

      const video =
        UploadHelper.getUploadUrlFromField(req.files, "video_file") ||
        req.body.video ||
        null;

      const data = {
        title,
        description,
        materials: ExperimentoController._toArray(materials),
        steps: ExperimentoController._toArray(steps),
        safety_measures: ExperimentoController._toArray(safety_measures),
        image,
        video,
        admin_id,
      };

      const result = await Experiment.create(data);

      req.flash("success_msg", "Experimento criado com sucesso");
      return res.redirect("/experimentos");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Erro ao criar experimento");
      res.redirect("/experimentos");
    }
  }

  // Atualizar experimento
  static async update(req, res) {
    try {
      const id = req.params.id;
      if ((req.user?.role || req.session.user?.role) !== "admin") {
        req.flash(
          "error_msg",
          "Apenas administradores podem atualizar experimentos"
        );
        return res.redirect("/experimentos");
      }

      const existing = await Experiment.findById(id);
      if (!existing) {
        req.flash("error_msg", "Experimento não encontrado");
        return res.redirect("/experimentos");
      }

      const title = req.body.title || req.body.titulo;
      const description = req.body.description || req.body.descricao;
      const materials = req.body.materials || req.body.materiais;
      const steps = req.body.steps || req.body.passos;
      const safety_measures =
        req.body.safety_measures || req.body.medidas_seguranca;

      const data = {
        title,
        description,
        materials: ExperimentoController._toArray(materials),
        steps: ExperimentoController._toArray(steps),
        safety_measures: ExperimentoController._toArray(safety_measures),
        image:
          UploadHelper.getUploadUrlFromField(req.files, "imagem_file") ||
          existing.image ||
          null,
        video:
          UploadHelper.getUploadUrlFromField(req.files, "video_file") ||
          existing.video ||
          null,
      };

      await Experiment.update(id, data);

      req.flash("success_msg", "Experimento atualizado com sucesso");
      return res.redirect(`/experimentos/${id}`);
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Erro ao atualizar experimento");
      res.redirect("/experimentos");
    }
  }

  // Deletar experimento
  static async delete(req, res) {
    try {
      const id = req.params.id;
      console.log("Deletando experimento com ID:", id);

      if ((req.user?.role || req.session.user?.role) !== "admin") {
        req.flash(
          "error_msg",
          "Apenas administradores podem deletar experimentos"
        );
        return res.redirect("/experimentos");
      }

      const existing = await Experiment.findById(id);

      if (!existing) {
        req.flash("error_msg", "Experimento não encontrado");
        return res.redirect("/experimentos");
      }

      await Experiment.delete(id);

      req.flash("success_msg", "Experimento deletado com sucesso");
      return res.redirect("/experimentos");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Erro ao deletar experimento");
      res.redirect("/experimentos");
    }
  }

  // Obter experimento por ID (detalhes)
  static async getById(req, res) {
    try {
      const id = req.params.id;
      const experiment = await Experiment.findById(id);

      if (!experiment) {
        req.flash("error_msg", "Experimento não encontrado");
        return res.redirect("/experimentos");
      }

      const curtido = req.session.user
        ? await Curtida.checkIfUserLiked(req.session.user.id, id)
        : false;

      const comentarios = await Comentario.findByExperiment(id);
      const curtidas = await Curtida.countLikes(id);

      const exp = {
        ...experiment,
        materiais: ExperimentoController._toArray(experiment.materials),
        passos: ExperimentoController._toArray(experiment.steps),
        medidas_seguranca: ExperimentoController._toArray(
          experiment.safety_measures
        ),
        curtidas,
      };

      const comentariosView = comentarios.map((c) => ({
        id: c.id,
        conteudo: c.content || c.conteudo,
        usuario: {
          id: c.user_id || c.usuario_id,
          nome: c.user_name || c.usuario_nome || c.nome,
        },
        data_criacao: c.created_at || c.data_criacao,
        isAuthor: (c.user_id || c.usuario_id) === req.session.user?.id,
      }));

      // Sempre renderiza HTML
      return res.render("experimentos/detalhe", {
        title: exp.title || exp.titulo,
        experimento: exp,
        comentarios: comentariosView,
        curtido,
        user: req.session.user,
        isAdmin: req.session.user?.role === "admin",
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Erro ao carregar experimento");
      return res.redirect("/experimentos");
    }
  }

  // Helpers
  static _toArray(field) {
    if (!field) return [];
    return Array.isArray(field) ? field : field.split("\n");
  }
}

module.exports = ExperimentoController;
