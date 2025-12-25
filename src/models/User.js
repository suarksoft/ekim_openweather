const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(email, password, fullName = null) {
    // Şifreyi hash'le
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, email, full_name, created_at`,
      [email, passwordHash, fullName]
    );
    return result.rows[0];
  }

  static async verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  static async emailExists(email) {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE email = $1',
      [email]
    );
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = User;

