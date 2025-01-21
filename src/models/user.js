import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = {
  async create(userData) {
    const { firstName, lastName, email, password, location, phoneNumber } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (first_name, last_name, email, password, location, phone_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email
    `;
    const values = [firstName, lastName, email, hashedPassword, location, phoneNumber];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await query(sql, [email]);
    return rows[0];
  },

  async findById(id) {
    const sql = 'SELECT id, first_name, last_name, email, location, phone_number FROM users WHERE id = $1';
    const { rows } = await query(sql, [id]);
    return rows[0];
  }
};

export default User;