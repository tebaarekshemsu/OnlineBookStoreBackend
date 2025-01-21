import { query } from '../config/database.js';

const Book = {
  async create(bookData) {
    const { title, author, photo, description, availablePieces, rating, price } = bookData;
    const sql = `
      INSERT INTO books (title, author, photo, description, available_pieces, rating, price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [title, author, photo, description, availablePieces, rating, price];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  async findAll() {
    const sql = 'SELECT * FROM books';
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id) {
    const sql = 'SELECT * FROM books WHERE id = $1';
    const { rows } = await query(sql, [id]);
    return rows[0];
  },

  async findTopRated(limit = 10) {
    const sql = 'SELECT * FROM books ORDER BY rating DESC LIMIT $1';
    const { rows } = await query(sql, [limit]);
    return rows;
  },

  async updateAvailablePieces(id, pieces) {
    const sql = 'UPDATE books SET available_pieces = available_pieces - $1 WHERE id = $2 RETURNING *';
    const { rows } = await query(sql, [pieces, id]);
    return rows[0];
  }
};

export default Book;