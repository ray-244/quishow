const Curtida = require("../models/Curtida");

class CurtidaController {
  static _getUserId(req) {
    return req.user?.id || req.session.user?.id;
  }

  static async toggleLike(req, res) {
    const experiment_id = req.params.id || req.params.id;
    const user_id = CurtidaController._getUserId(req);

    if (!user_id) {
      return res.status(401).json({
        message: "Você precisa estar logado para curtir.",
        action: "login",
      });
    }

    try {
      console.log(
        "👍 Toggleando like - Usuario:",
        user_id,
        "Experimento:",
        experiment_id
      );

      const hasLiked = await Curtida.checkIfUserLiked(user_id, experiment_id);

      if (hasLiked) {
        req.flash("info_msg", "Removendo curtida");
        await Curtida.delete(user_id, experiment_id);
        return res.redirect(`/experimentos/${experiment_id}`);
      } else {
        console.log("✅ Adicionando curtida");
        req.flash("success_msg", "Adicionando curtida");
        await Curtida.create(user_id, experiment_id);
        return res.redirect(`/experimentos/${experiment_id}`);
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar comentário:", error);

      if (req.accepts("html")) {
        req.flash("error_msg", "Erro ao atualizar comentário.");
        return res.redirect(`/experimentos/${experiment_id || ""}`);
      }
    }
  }

  static async checkUserLike(req, res) {
    const experiment_id = req.params.experiment_id || req.params.id;
    const user_id = CurtidaController._getUserId(req);

    if (!user_id) {
      return res.json({ liked: false });
    }

    try {
      const hasLiked = await Curtida.checkIfUserLiked(user_id, experiment_id);
      res.json({ liked: hasLiked });
    } catch (error) {
      console.error("❌ Erro ao verificar like do usuário:", error);
      res
        .status(500)
        .json({ message: "Erro interno do servidor", error: error.message });
    }
  }
}

module.exports = CurtidaController;
