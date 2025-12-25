const pool = require('../config/database');

class Decision {
  static async findAll(userId) {
    const result = await pool.query(
      `SELECT d.*, f.name as farm_name, f.city, f.district
       FROM planting_decisions d
       LEFT JOIN farms f ON d.farm_id = f.id
       WHERE f.user_id = $1
       ORDER BY d.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      `SELECT d.*, f.name as farm_name, f.city, f.district, f.crop_type as farm_crop_type
       FROM planting_decisions d
       LEFT JOIN farms f ON d.farm_id = f.id
       WHERE d.id = $1 AND f.user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { farm_id, crop_type, decision_status, reason, weather_snapshot_json } = data;
    const result = await pool.query(
      `INSERT INTO planting_decisions 
       (farm_id, crop_type, decision_status, reason, weather_snapshot_json, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [farm_id, crop_type, decision_status, reason, weather_snapshot_json ? JSON.stringify(weather_snapshot_json) : null]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    // Önce kullanıcının tarlasına ait olup olmadığını kontrol et
    const decision = await pool.query(
      `SELECT d.id FROM planting_decisions d
       JOIN farms f ON d.farm_id = f.id
       WHERE d.id = $1 AND f.user_id = $2`,
      [id, userId]
    );
    
    if (decision.rows.length === 0) {
      return null;
    }
    
    const result = await pool.query(
      'DELETE FROM planting_decisions WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Decision;

