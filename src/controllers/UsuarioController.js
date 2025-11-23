const User = require("../models/Usuario");
const bcrypt = require("bcryptjs");

class UsuarioController {

  // Página de cadastro
  static renderCadastro(req, res) {
    res.render("auth/cadastro", {
      title: "Cadastro",
      user: req.session.user || null,
      year: new Date().getFullYear(),
    });
  }

  // Página de login
  static renderLogin(req, res) {
    res.render("auth/login", {
      title: "Entrar",
      user: req.session.user || null,
      year: new Date().getFullYear(),
    });
  }

  // Sair da sessão
  static sair(req, res) {
    req.session.destroy(() => res.redirect("/auth/entrar"));
  }

  // Página de perfil
  static renderPerfil(req, res) {
    if (!req.session.user) {
      req.flash("error_msg", "Usuário não autenticado");
      return res.redirect("/auth/entrar");
    }

    res.render("auth/perfil", {
      title: "Meu Perfil",
      user: req.session.user,
      year: new Date().getFullYear(),
    });
  }

  // Cadastro
  static async register(req, res) {
    try {
      const nome = req.body.nome || req.body.name;
      const email = req.body.email;
      const senha = req.body.senha || req.body.password;
      const confirmar = req.body.confirmar_senha || req.body.confirm_password;
      const tipo = req.body.tipo || req.body.role;
      const redirect = "/auth/cadastro";

      // Valida campos obrigatórios
      if (!nome || !email || !senha) {
        req.flash("error_msg", "Todos os campos são obrigatórios");
        return res.redirect(redirect);
      }

      if (senha !== confirmar) {
        req.flash("error_msg", "As senhas não conferem");
        return res.redirect(redirect);
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        req.flash("error_msg", "Email já cadastrado");
        return res.redirect(redirect);
      }

      // Criar usuário
      const hashed = await bcrypt.hash(senha, 10);
      const role = tipo === "professor" || tipo === "admin" ? "admin" : "user";

      const result = await User.create({
        name: nome,
        email,
        password: hashed,
        role,
      });

      // Salva sessão
      req.session.user = {
        id: result.id,
        name: nome,
        email,
        role,
      };

      req.flash("success_msg", "Cadastro realizado com sucesso");
      return res.redirect("/");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Erro interno do servidor");
      return res.redirect("/auth/cadastro");
    }
  }

  // Login
  static async login(req, res) {
    try {
      const email = req.body.email;
      const senha = req.body.senha || req.body.password;
      const redirect = "/auth/entrar";

      if (!email || !senha) {
        req.flash("error_msg", "Email e senha são obrigatórios");
        return res.redirect(redirect);
      }

      const user = await User.findByEmail(email);
      if (!user || !(await bcrypt.compare(senha, user.password))) {
        req.flash("error_msg", "Credenciais inválidas");
        return res.redirect(redirect);
      }

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      req.flash("success_msg", "Login realizado com sucesso");
      return res.redirect("/");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Erro interno do servidor");
      return res.redirect("/auth/entrar");
    }
  }

  // Atualizar perfil via sessão
  static async updateProfileSession(req, res) {
    try {
      const userId = req.session.user.id;
      const nome = req.body.nome || req.body.name;
      const email = req.body.email;
      const redirect = "/auth/perfil";

      if (!nome || !email) {
        req.flash("error_msg", "Nome e email são obrigatórios");
        return res.redirect(redirect);
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        req.flash("error_msg", "Email já está em uso por outro usuário");
        return res.redirect(redirect);
      }

      await User.update(userId, { name: nome, email });

      // Atualiza sessão
      req.session.user.name = nome;
      req.session.user.email = email;

      req.flash("success_msg", "Perfil atualizado com sucesso");
      return res.redirect(redirect);
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Erro ao atualizar perfil");
      return res.redirect("/perfil");
    }
  }
}

module.exports = UsuarioController;
