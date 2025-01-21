import { query } from '../config/database.js';

const Cart = {
  async addItem(userId, bookId, quantity) {
    const sql = `
      INSERT INTO cart_items (user_id, book_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, book_id) DO UPDATE SET quantity = cart_items.quantity + $3
      RETURNING *
    `;
    const values = [userId, bookId, quantity];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  async getItems(userId) {
    const sql = `
      SELECT ci.id, ci.quantity, b.*
      FROM cart_items ci
      JOIN books b ON ci.book_id = b.id
      WHERE ci.user_id = $1
    `;
    const { rows } = await query(sql, [userId]);
    return rows;
  },

  async updateItemQuantity(id, quantity) {
    const sql = 'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *';
    const { rows } = await query(sql, [quantity, id]);
    return rows[0];
  },

  async removeItem(id) {
    const sql = 'DELETE FROM cart_items WHERE id = $1';
    await query(sql, [id]);
  },

  async clearCart(userId) {
    const sql = 'DELETE FROM cart_items WHERE user_id = $1';
    await query(sql, [userId]);
  }
};

export default Cart;