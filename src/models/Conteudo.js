const db = require("../config/database");

class ConteudoTeorico {
  static async query(sql, params = []) {
    try {
      const [results] = await db.query(sql, params);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async create(data) {
    const sql = `
            INSERT INTO theory_contents (title, content, image, video, admin_id)
            VALUES (?, ?, ?, ?, ?)
        `;
    const result = await this.query(sql, [
      data.title,
      data.content,
      data.image || null,
      data.video || null,
      data.admin_id,
    ]);
    return { id: result.insertId, ...data };
  }


  static async findAll() {
    const sql = "SELECT * FROM theory_contents ORDER BY id DESC";
    return this.query(sql);
  }

  static async findById(id) {
    const sql = "SELECT * FROM theory_contents WHERE id = ? LIMIT 1";
    const results = await this.query(sql, [id]);
    return results[0]; 
  }

  static async update(id, data) {
    const sql = `
            UPDATE theory_contents
            SET title = ?, content = ?, image = ?, video = ?
            WHERE id = ?
        `;
    await this.query(sql, [
      data.title,
      data.content,
      data.image || null,
      data.video || null,
      id,
    ]);
    return { id, ...data };
  }

  static async delete(id) {
    const sql = "DELETE FROM theory_contents WHERE id = ?";
    return this.query(sql, [id]);
  }

  static async search(term) {
    const sql =
      "SELECT * FROM theory_contents WHERE title LIKE ? OR content LIKE ?";
    const searchTerm = `%${term}%`;
    return this.query(sql, [searchTerm, searchTerm]);
  }
}

module.exports = ConteudoTeorico;
