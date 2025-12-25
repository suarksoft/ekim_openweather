const pool = require('../config/database');

class Farm {
  static async findAll(userId) {
    const result = await pool.query(
      'SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM farms WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async create(data, userId) {
    const { name, city, district, crop_type, area_decare } = data;
    const result = await pool.query(
      `INSERT INTO farms (user_id, name, city, district, crop_type, area_decare, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [userId, name, city, district, crop_type || null, area_decare]
    );
    return result.rows[0];
  }

  static async update(id, data, userId) {
    const { name, city, district, crop_type, area_decare } = data;
    const result = await pool.query(
      `UPDATE farms 
       SET name = $1, city = $2, district = $3, crop_type = $4, area_decare = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [name, city, district, crop_type || null, area_decare, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM farms WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Farm;

