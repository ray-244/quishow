const db = require("../config/database");

class Curtida {
  // Método genérico para executar queries
  static async query(sql, params = []) {
    try {
      const [results] = await db.query(sql, params);
      return results;
    } catch (err) {
      throw err;
    }
  }

  // Criar curtida
  static async create(userId, experimentId) {
    const sql = `
      INSERT INTO likes (user_id, experiment_id)
      VALUES (?, ?)
    `;
    const result = await this.query(sql, [userId, experimentId]);
    return {
      user_id: userId,
      experiment_id: experimentId,
      id: result.insertId,
    };
  }

  // Deletar curtida
  static async delete(userId, experimentId) {
    const sql = `
      DELETE FROM likes
      WHERE user_id = ? AND experiment_id = ?
    `;
    await this.query(sql, [userId, experimentId]);
    return { user_id: userId, experiment_id: experimentId };
  }

  // Verifica se usuário curtiu o experimento
  static async checkIfUserLiked(userId, experimentId) {
    const sql = `
      SELECT 1
      FROM likes
      WHERE user_id = ? AND experiment_id = ?
      LIMIT 1
    `;
    const results = await this.query(sql, [userId, experimentId]);
    return results.length > 0;
  }

  // Contar curtidas de um experimento
  static async countLikes(experimentId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM likes
      WHERE experiment_id = ?
    `;
    const results = await this.query(sql, [experimentId]);
    return results[0]?.count || 0;
  }
}

module.exports = Curtida;
