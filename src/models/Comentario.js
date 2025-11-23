const db = require("../config/database");

class Comentario {
  // Método genérico para executar queries
  static async query(sql, params = []) {
    try {
      const [results] = await db.query(sql, params);
      return results;
    } catch (err) {
      throw err;
    }
  }

  // Criar comentário
  static async create({ content, user_id, experiment_id }) {
    const sql = `
      INSERT INTO comments (content, user_id, experiment_id)
      VALUES (?, ?, ?)
    `;
    const result = await this.query(sql, [content, user_id, experiment_id]);
    return { id: result.insertId, content, user_id, experiment_id };
  }

  static async findById(id) {
    const sql = `
      SELECT *
      FROM comments c
      WHERE c.id = ?
    `;
    const results = await this.query(sql, [id]);

    return results[0] || null;
  }

  // Buscar comentários por experimento
  static async findByExperiment(experimentId) {
    const sql = `
      SELECT c.*, u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.experiment_id = ?
      ORDER BY c.created_at DESC
    `;
    return await this.query(sql, [experimentId]);
  }

  // Atualizar comentário
  static async update(id, userId, content) {
    const sql = `
      UPDATE comments
      SET content = ?
      WHERE id = ? AND user_id = ?
    `;
    const result = await this.query(sql, [content, id, userId]);
    return result;
  }

  // Deletar comentário
  static async delete(id, userId) {
    const sql = `
      DELETE FROM comments
      WHERE id = ? AND user_id = ?
    `;
    await this.query(sql, [id, userId]);
    return { id, user_id: userId };
  }
}

module.exports = Comentario;
