import  pool from '../config/database.js';

const Order = {
  async create(userId, items, totalPrice) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const orderSql = `
        INSERT INTO orders (user_id, total_price, order_date, delivery_status)
        VALUES ($1, $2, NOW(), 'not_delivered')
        RETURNING *
      `;
      const orderValues = [userId, totalPrice];
      const { rows: [order] } = await client.query(orderSql, orderValues);

      for (const item of items) {
        const orderItemSql = `
          INSERT INTO order_items (order_id, book_id, quantity, price)
          VALUES ($1, $2, $3, $4)
        `;
        const orderItemValues = [order.id, item.id, item.quantity, item.price];
        await client.query(orderItemSql, orderItemValues);

        const updateBookSql = `
          UPDATE books
          SET available_pieces = available_pieces - $1
          WHERE id = $2
        `;
        const updateBookValues = [item.quantity, item.id];
        await client.query(updateBookSql, updateBookValues);
      }

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async findByUserId(userId) {
    const sql = `
      SELECT o.*, json_agg(json_build_object(
        'id', oi.id,
        'book_id', oi.book_id,
        'quantity', oi.quantity,
        'price', oi.price,
        'title', b.title,
        'author', b.author
      )) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN books b ON oi.book_id = b.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.order_date DESC
    `;
    const { rows } = await query(sql, [userId]);
    return rows;
  },

  async updateDeliveryStatus(orderId, status) {
    const sql = `
      UPDATE orders
      SET delivery_status = $1
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await query(sql, [status, orderId]);
    return rows[0];
  }
};

export default Order;