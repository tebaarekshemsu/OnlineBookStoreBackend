import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createTables = async (req, res) => {
  try {
    // Enable uuid-ossp extension
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        phone_number VARCHAR(20)
      )
    `);

    // Create books table
    await query(`
      CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        photo VARCHAR(255),
        description TEXT,
        available_pieces INTEGER NOT NULL,
        rating DECIMAL(3,2),
        price DECIMAL(10,2) NOT NULL
      )
    `);

    // Create cart_items table
    await query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        book_id UUID REFERENCES books(id),
        quantity INTEGER NOT NULL,
        UNIQUE(user_id, book_id)
      )
    `);

    // Create orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        total_price DECIMAL(10,2) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivery_status VARCHAR(50) DEFAULT 'not_delivered'
      )
    `);

    // Create order_items table
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id),
        book_id UUID REFERENCES books(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL
      )
    `);

    res.json({ message: 'Tables created successfully' });
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ message: 'Error creating tables' });
  }
};

export const populateDatabase = async (req, res) => {
  try {
    // Insert sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await query(`
      INSERT INTO users (first_name, last_name, email, password, location, phone_number)
      VALUES 
        ('John', 'Doe', 'john@example.com', $1, 'New York', '1234567890'),
        ('Jane', 'Smith', 'jane@example.com', $1, 'Los Angeles', '9876543210')
    `, [hashedPassword]);

    // Insert sample books
    await query(`
      INSERT INTO books (title, author, photo, description, available_pieces, rating, price)
      VALUES 
        ('The Great Gatsby', 'F. Scott Fitzgerald', 'https://example.com/great-gatsby.jpg', 'A classic novel about the American Dream', 50, 4.5, 15.99),
        ('To Kill a Mockingbird', 'Harper Lee', 'https://example.com/mockingbird.jpg', 'A powerful story of racial injustice', 40, 4.8, 14.99),
        ('1984', 'George Orwell', 'https://example.com/1984.jpg', 'A dystopian novel about totalitarianism', 30, 4.6, 13.99),
        ('Pride and Prejudice', 'Jane Austen', 'https://example.com/pride-prejudice.jpg', 'A romantic novel of manners', 35, 4.7, 12.99),
        ('The Catcher in the Rye', 'J.D. Salinger', 'https://example.com/catcher-rye.jpg', 'A coming-of-age story', 45, 4.3, 11.99)
    `);

    res.json({ message: 'Database populated successfully' });
  } catch (error) {
    console.error('Error populating database:', error);
    res.status(500).json({ message: 'Error populating database' });
  }
};