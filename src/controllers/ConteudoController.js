const ConteudoTeorico = require("../models/Conteudo");
const UploadHelper = require("../utils/uploadHelper");

class ConteudoTeoricoController {
  static _getUserRole(req) {
    return req.user?.role || req.session.user?.role;
  }

  static async listar(req, res) {
    try {
      console.log("📚 Listando conteúdos teóricos");
      const conteudos = await ConteudoTeorico.findAll();

      const conteudosMapeados = conteudos.map((c) => ({
        id: c.id,
        titulo: c.title || c.titulo,
        conteudo: c.content || c.conteudo,
        imagem: c.image || c.imagem || null,
        video: c.video || c.video || null,
        data_criacao: c.created_at || c.data_criacao,
      }));

      res.render("conteudos/lista", {
        title: "Conteúdos Teóricos",
        conteudos: conteudosMapeados,
        user: req.session.user,
        isAdmin: ConteudoTeoricoController._getUserRole(req) === "admin",
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("❌ Erro ao listar conteúdos:", error);
      req.flash("error_msg", "Erro ao carregar conteúdos");
      res.redirect("/");
    }
  }

  static renderNovo(req, res) {
    if (ConteudoTeoricoController._getUserRole(req) !== "admin") {
      req.flash(
        "error_msg",
        "Acesso negado. Apenas administradores podem criar conteúdos."
      );
      return res.redirect("/conteudos");
    }

    res.render("conteudos/form", {
      title: "Novo Conteúdo Teórico",
      user: req.session.user,
      isAdmin: true,
      year: new Date().getFullYear(),
    });
  }

  static async renderEditar(req, res) {
    if (ConteudoTeoricoController._getUserRole(req) !== "admin") {
      req.flash(
        "error_msg",
        "Acesso negado. Apenas administradores podem editar conteúdos."
      );
      return res.redirect("/conteudos");
    }

    try {
      const { id } = req.params;
      const content = await ConteudoTeorico.findById(id);

      if (!content) {
        req.flash("error_msg", "Conteúdo não encontrado");
        return res.redirect("/conteudos");
      }

      const conteudo = {
        id: content.id,
        titulo: content.title || content.titulo,
        conteudo: content.content || content.conteudo,
        imagem: content.image || content.imagem || null,
        video: content.video || content.video || null,
        data_criacao: content.created_at || content.data_criacao,
      };

      res.render("conteudos/form", {
        title: "Editar Conteúdo Teórico",
        conteudo,
        user: req.session.user,
        isAdmin: true,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("❌ Erro ao carregar conteúdo:", error);
      req.flash("error_msg", "Erro ao carregar conteúdo");
      res.redirect("/conteudos");
    }
  }

  // Criar
  static async create(req, res) {
    try {
      console.log("📝 Criando conteúdo teórico");

      const admin_id = req.user?.id || req.session.user?.id;
      if ((req.user?.role || req.session.user?.role) !== "admin") {
        req.flash(
          "error_msg",
          "Apenas administradores podem criar experimentos"
        );
        return res.redirect("/experimentos");
      }

      const titulo = req.body.titulo || req.body.title;
      const conteudo = req.body.conteudo || req.body.content;
      const role = ConteudoTeoricoController._getUserRole(req); // 💡 Usando o helper

      if (!titulo || !conteudo) {
        req.flash("error_msg", "Título e conteudo são obrigatórios");
        return res.redirect("/conteudos/novo");
      }
      // Processar uploads
      const imagePath =
        UploadHelper.getUploadUrlFromField(req.files, "imagem_file") ||
        req.body.imagem ||
        null;
      const videoPath =
        UploadHelper.getUploadUrlFromField(req.files, "video_file") ||
        req.body.video ||
        null;

      const contentData = {
        title: titulo,
        content: conteudo,
        image: imagePath,
        video: videoPath,
        admin_id,
      };

      console.log("✅ Criando conteúdo:", contentData);
      const result = await ConteudoTeorico.create(contentData);

      req.flash("success_msg", "Conteúdo teórico criado com sucesso");
      return res.redirect("/conteudos");
    } catch (error) {
      console.error("❌ Erro ao criar conteúdo:", error);
      req.flash("error_msg", "Erro ao criar conteúdo");
      res.redirect("/conteudos/novo");
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      console.log("🔍 Buscando conteúdo:", id);
      const content = await ConteudoTeorico.findById(id);

      if (!content) {
        req.flash("error_msg", "Experimento não encontrado");
        return res.redirect("/experimentos");
      }

      const role = ConteudoTeoricoController._getUserRole(req);

      const conteudo = {
        id: content.id,
        titulo: content.title || content.titulo,
        conteudo: content.content || content.conteudo,
        imagem: content.image || content.imagem || null,
        video: content.video || content.video || null,
        data_criacao: content.created_at || content.data_criacao,
      };

      return res.render("conteudos/detalhe", {
        title: conteudo.titulo,
        conteudo,
        user: req.session.user,
        isAdmin: role === "admin",
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("❌ Erro ao buscar conteúdo:", error);
      req.flash("error_msg", "Erro ao carregar conteúdo");
      res.redirect("/conteudos");
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      if ((req.user?.role || req.session.user?.role) !== "admin") {
        req.flash(
          "error_msg",
          "Apenas administradores podem atualizar conteúdos"
        );
        return res.redirect("/conteudos");
      }
      const existing = await ConteudoTeorico.findById(id);
      if (!existing) {
        req.flash("error_msg", "Conteudo não encontrado");
        return res.redirect("/conteudos");
      }

      const titulo = req.body.titulo || req.body.title;
      const conteudo = req.body.conteudo || req.body.content;
      const role = ConteudoTeoricoController._getUserRole(req);

      // Processar uploads
      const imagePath =
        UploadHelper.getUploadUrlFromField(req.files, "imagem_file") ||
        existingContent.image ||
        existingContent.imagem ||
        null;
      const videoPath =
        UploadHelper.getUploadUrlFromField(req.files, "video_file") ||
        existingContent.video ||
        existingContent.video ||
        null;

      const contentData = {
        title: titulo,
        content: conteudo,
        image: imagePath,
        video: videoPath,
      };

      console.log("✅ Atualizando conteúdo:", contentData);
      await ConteudoTeorico.update(id, contentData);
      req.flash("success_msg", "Conteúdo teórico atualizado com sucesso");
      return res.redirect(`/conteudos/${id}`);
    } catch (error) {
      console.error("❌ Erro ao atualizar conteúdo:", error);
      req.flash("error_msg", "Erro ao atualizar conteudo");
      res.redirect("/conteudos");
    }
  }

  // Deletar
  static async delete(req, res) {
    try {
      const { id } = req.params;
      console.log("🗑️ Deletando conteúdo:", id);

      if ((req.user?.role || req.session.user?.role) !== "admin") {
        req.flash(
          "error_msg",
          "Apenas administradores podem deletar experimentos"
        );
        return res.redirect("/experimentos");
      }

      const content = await ConteudoTeorico.findById(id);
      if (!content) {
        req.flash("error_msg", "Conteudo não encontrado");
        return res.redirect("/experimentos");
      }

      console.log("✅ Deletando conteúdo");
      await ConteudoTeorico.delete(id);

      req.flash("success_msg", "Conteúdo teórico deletado com sucesso");
      return res.redirect("/conteudos");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Erro ao deletar experimento");
      res.redirect("/experimentos");
    }
  }

  static async search(req, res) {
    try {
      const termo = req.query.termo || req.query.term;
      if (!termo) {
        const redirectPath = req.accepts("html") ? "/conteudos" : null;
        if (redirectPath) req.flash("error_msg", "Digite um termo para buscar");
        return res.redirect(redirectPath);
      }

      console.log("🔍 Buscando conteúdos:", termo);
      const results = await ConteudoTeorico.search(termo);

      if (req.accepts("html")) {
        const conteudos = results.map((c) => ({
          id: c.id,
          titulo: c.title || c.titulo,
          conteudo: c.content || c.conteudo,
          imagem: c.image || c.imagem || null,
          video: c.video || c.video || null,
          data_criacao: c.created_at || c.data_criacao,
        }));

        return res.render("conteudos/lista", {
          title: "Resultados da Busca",
          conteudos,
          termo,
          user: req.session.user,
          isAdmin: ConteudoTeoricoController._getUserRole(req) === "admin",
          year: new Date().getFullYear(),
        });
      }

      res.json(results);
    } catch (error) {
      console.error("❌ Erro ao buscar conteúdos:", error);
      const redirectPath = req.accepts("html") ? "/conteudos" : null;
      if (redirectPath) req.flash("error_msg", "Erro ao realizar busca");
      return redirectPath
        ? res.redirect(redirectPath)
        : res.status(500).json({
            message: "Erro interno do servidor",
            error: error.message,
          });
    }
  }
}

module.exports = ConteudoTeoricoController;
