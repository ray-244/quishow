const db = require("../config/database");

class Experimento {
  static async query(sql, params = []) {
    try {
      const [results] = await db.query(sql, params);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static _parseStringFields(experiment) {
    if (!experiment) return null;

    const fieldsToProcess = ["materials", "steps", "safety_measures"];

    fieldsToProcess.forEach((field) => {
      if (experiment[field] && typeof experiment[field] === "string") {
        const items = experiment[field]
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        experiment[field] = items;
      } else {
        experiment[field] = [];
      }
    });
    return experiment;
  }

  static async create(data) {
    const sql = `
            INSERT INTO experiments
            (title, description, materials, steps, safety_measures, image, video, admin_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const result = await this.query(sql, [
      data.title,
      data.description,
      data.materials.join("\n"),
      data.steps.join("\n"),
      data.safety_measures.join("\n"),
      data.image || null,
      data.video || null,
      data.admin_id,
    ]);
    return { id: result.insertId, ...data };
  }

  static async findAll() {
    const results = await this.query(
      "SELECT * FROM experiments ORDER BY id DESC"
    );
    return results.map((e) => this._parseStringFields(e));
  }

  static async findById(id) {
    const results = await this.query(
      "SELECT * FROM experiments WHERE id = ? LIMIT 1",
      [id]
    );
    return this._parseStringFields(results[0]);
  }

  static async update(id, data) {
    const sql = `
            UPDATE experiments
            SET title = ?, description = ?, materials = ?, steps = ?, safety_measures = ?, image = ?, video = ?
            WHERE id = ?
        `;
    await this.query(sql, [
      data.title,
      data.description,
      data.materials.join("\n"),
      data.steps.join("\n"),
      data.safety_measures.join("\n"),
      data.image || null,
      data.video || null,
      id,
    ]);
    return { id, ...data };
  }

  static async delete(id) {
    return this.query("DELETE FROM experiments WHERE id = ?", [id]);
  }

  static async getMostPopular(limit = 10) {
    return this.query(
      `
            SELECT e.*, COUNT(l.id) as likes_count
            FROM experiments e
            LEFT JOIN likes l ON e.id = l.experiment_id
            GROUP BY e.id
            ORDER BY likes_count DESC
            LIMIT ?
        `,
      [limit]
    );
  }
}

module.exports = Experimento;
