// models/Usuario.js
const db = require("../config/database");

class Usuario {
  // Método genérico para executar queries
  static async query(sql, params = []) {
    try {
      const [results] = await db.query(sql, params);
      return results;
    } catch (err) {
      throw err;
    }
  }

  // Criar um usuário
  static async create({ name, email, password, role = "user" }) {
    const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;
    const result = await this.query(sql, [name, email, password, role]);
    return { id: result.insertId, name, email, role };
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const results = await this.query(sql, [email]);
    return results[0] || null;
  }

  // Buscar usuário por id
  static async findById(id) {
    const sql = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }

  // Atualizar usuário
  static async update(id, { name, email }) {
    const sql = `
            UPDATE users
            SET name = ?, email = ?
            WHERE id = ?
        `;
    await this.query(sql, [name, email, id]);
    return { id, name, email };
  }

  // Deletar usuário
  static async delete(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    return await this.query(sql, [id]);
  }
}

module.exports = Usuario;
