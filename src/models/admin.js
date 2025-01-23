// import { query } from '../config/database.js';
// import bcrypt from 'bcryptjs';

// const Admin = {
//   async create(adminData) {
//     const { username, password, email } = adminData;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const sql = `
//       INSERT INTO admins (username, password, email)
//       VALUES ($1, $2, $3)
//       RETURNING id, username, email
//     `;
//     const values = [username, hashedPassword, email];
//     const { rows } = await query(sql, values);
//     return rows[0];
//   },

//   async findByUsername(username) {
//     const sql = 'SELECT * FROM admins WHERE username = $1';
//     const { rows } = await query(sql, [username]);
//     return rows[0];
//   },

//   async findById(id) {
//     const sql = 'SELECT id, username, email FROM admins WHERE id = $1';
//     const { rows } = await query(sql, [id]);
//     return rows[0];
//   },

//   async findByEmail(email) {
//     const sql = 'SELECT * FROM admins WHERE email = $1';
//     const { rows } = await query(sql, [email]);
//     return rows[0];
//   }
// };

// export default Admin;