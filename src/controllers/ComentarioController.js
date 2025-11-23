const Comentario = require("../models/Comentario");

class ComentarioController {
  static _getUserId(req) {
    return req.user?.id || req.session.user?.id;
  }

  static _getUserRole(req) {
    return req.user?.role || req.session.user?.role;
  }

  static async create(req, res) {
    console.log("💬 Recebendo requisição para criar comentário");
    const experiment_id = req.params.id;
    const user_id = ComentarioController._getUserId(req);

    if (!user_id) {
      req.flash("error_msg", "Você precisa estar logado para comentar.");
      return res.redirect(`/experimentos/${experiment_id || ""}`);
    }

    try {
      const { comentario } = req.body;

      console.log(
        "💬 Criando comentário - Usuario:",
        user_id,
        "Experimento:",
        experiment_id
      );

      const comentarioConteudo = comentario;

      if (!comentarioConteudo || comentarioConteudo.trim().length === 0) {
        req.flash("error_msg", "O conteúdo do comentário é obrigatório.");
        return res.redirect(`/experimentos/${experiment_id}`);
      }

      if (!experiment_id) {
        req.flash("error_msg", "Experimento não especificado.");
        return res.redirect(`/experimentos`);
      }

      console.log("💬 Dados do comentário validados com sucesso");
      const commentData = {
        content: comentarioConteudo,
        user_id,
        experiment_id,
      };

      await Comentario.create(commentData);

      if (req.accepts("html")) {
        req.flash("success_msg", "Comentário criado com sucesso!");
        return res.redirect(`/experimentos/${experiment_id}`);
      }

      // Retorno JSON (se a requisição não for HTML)
      res.status(201).json({ message: "Comentário criado com sucesso" });
    } catch (error) {
      console.error("❌ Erro ao criar comentário:", error);

      if (req.accepts("html")) {
        req.flash("error_msg", "Erro ao criar comentário.");
        return res.redirect(`/experimentos/${experiment_id || ""}`);
      }

      res
        .status(500)
        .json({ message: "Erro interno do servidor", error: error.message });
    }
  }

  static async update(req, res) {
    const comment_id = req.params.idComment || req.params.idComment; // Assume que o ID está no parâmetro
    const experiment_id = req.params.id || req.body.id || req.params.id;
    const user_id = ComentarioController._getUserId(req);

    if (!user_id) {
      req.flash(
        "error_msg",
        "Você precisa estar logado para atualizar um comentário."
      );
      return res.redirect(`/experimentos/${experiment_id || ""}`);
    }

    try {
      const { comentario } = req.body;
      const comentarioConteudo = comentario;

      if (!comentarioConteudo || comentarioConteudo.trim().length === 0) {
        req.flash("error_msg", "O conteúdo do comentário é obrigatório.");
        return res.redirect(`/experimentos/${experiment_id}`);
      }

      const existing = await Comentario.findById(comment_id);
      if (!existing) {
        req.flash("error_msg", "Comentário não encontrado.");
        return res.redirect(`/experimentos/${experiment_id}`);
      }

      if (existing.user_id !== user_id) {
        req.flash(
          "error_msg",
          "Você só pode editar seus próprios comentários."
        );
        return res.redirect(`/experimentos/${existing.experiment_id}`);
      }

      console.log(`✏️ Atualizando comentário ${comment_id}`);

      const updateData = {
        content: comentarioConteudo,
      };

      await Comentario.update(comment_id, user_id, updateData.content);

      req.flash("success_msg", "Comentário atualizado com sucesso!");
      return res.redirect(`/experimentos/${existing.experiment_id}`);
    } catch (error) {
      console.error("❌ Erro ao atualizar comentário:", error);

      if (req.accepts("html")) {
        req.flash("error_msg", "Erro ao atualizar comentário.");
        return res.redirect(`/experimentos/${experiment_id || ""}`);
      }
    }
  }

  static async delete(req, res) {
    const comment_id = req.params.idComment || req.params.idComment;
    const experiment_id = req.params.id || req.body.id || req.params.id;
    const user_id = ComentarioController._getUserId(req);
    const user_role = ComentarioController._getUserRole(req);

    if (!user_id) {
      req.flash(
        "error_msg",
        "Você precisa estar logado para deletar um comentário."
      );
      return res.redirect(`/experimentos/${experiment_id || ""}`);
    }

    try {
      const existing = await Comentario.findById(comment_id);
      if (!existing) {
        req.flash("error_msg", "Comentário não encontrado.");
        return res.redirect(`/experimentos/${experiment_id}`);
      }

      const isAuthor = existing.user_id === user_id;
      const isAdmin = user_role === "admin";

      if (!isAuthor && !isAdmin) {
        req.flash(
          "error_msg",
          "Você não tem permissão para deletar este comentário."
        );
        return res.redirect(`/experimentos/${existing.experiment_id}`);
      }

      console.log(`🗑️ Deletando comentário ${comment_id}`);

      await Comentario.delete(comment_id, user_id);

      req.flash("success_msg", "Comentário deletado com sucesso!");
      return res.redirect(`/experimentos/${existing.experiment_id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar comentário:", error);

      if (req.accepts("html")) {
        req.flash("error_msg", "Erro ao deletar comentário.");
        return res.redirect(`/experimentos/${experiment_id || ""}`);
      }
    }
  }
}

module.exports = ComentarioController;
