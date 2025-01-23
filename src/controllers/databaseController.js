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
    // Insert sample users (optional, you can uncomment the lines below)
    // const hashedPassword = await bcrypt.hash('password123', 10);
    // await query(`
    //   INSERT INTO users (first_name, last_name, email, password, location, phone_number)
    //   VALUES 
    //     ('John', 'Doe', 'john@example.com', $1, 'New York', '1234567890'),
    //     ('Jane', 'Smith', 'jane@example.com', $1, 'Los Angeles', '9876543210')
    // `, [hashedPassword]);

    // Insert sample books
await query(`
  INSERT INTO books (title, author, photo, description, available_pieces, rating, price)
  VALUES 
    ('The Hobbit', 'J.R.R. Tolkien', 'https://m.media-amazon.com/images/I/712cDO7d73L._AC_UF1000,1000_QL80_.jpg', 'A fantasy adventure about Bilbo Baggins', 60, 4.8, 16.99),
    ('The Alchemist', 'Paulo Coelho', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRK3ynkB4fskJ9zks2jPGX2rDozHEtPfMCSQ&s', 'A philosophical novel about following your dreams', 50, 4.6, 14.49),
    ('The Da Vinci Code', 'Dan Brown', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWEzVkjNpEcK_RnoqSbbofT69lBCA_YUiuYg&s', 'A mystery thriller about hidden secrets in art', 70, 4.4, 15.99),
    ('Harry Potter and the Sorcerer Stone', 'J.K. Rowling', 'https://m.media-amazon.com/images/I/71XqqKTZz7L._AC_UF1000,1000_QL80_.jpg', 'The magical story of Harry Potter first year at Hogwarts', 80, 4.9, 18.99),
    ('The Fault in Our Stars', 'John Green', 'https://m.media-amazon.com/images/M/MV5BYTA4ODg5YWUtYmZiYy00Y2M4LWE0NjEtODE5MzhkYmJmZGEwXkEyXkFqcGc@._V1_.jpg', 'A love story of two teens battling illness', 65, 4.7, 13.99),
    ('The Road', 'Cormac McCarthy', 'https://m.media-amazon.com/images/I/51M7XGLQTBL._AC_UF894,1000_QL80_.jpg', 'A post-apocalyptic tale of survival', 40, 4.5, 14.99),
    ('Brave New World', 'Aldous Huxley', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkSor7LOFTupY3jAzgRqIDSMK8xQJT3y1VOA&s', 'A dystopian story about a highly controlled society', 55, 4.6, 13.49),
    ('Moby-Dick', 'Herman Melville', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSir5qkvZPmvjLUn3kVcB6n1oEYPIvx1Nv7xg&s', 'An epic tale of obsession and revenge on the high seas', 35, 4.2, 17.99),
    ('The Kite Runner', 'Khaled Hosseini', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18UQ4681tsp-b_YJnu-toSP4YMEZVa4t6ug&s', 'A story of friendship and redemption in Afghanistan', 45, 4.8, 12.99),
    ('The Lord of the Rings: The Fellowship of the Ring', 'J.R.R. Tolkien', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6nAt9HTcxPw4yDBc5R6x009j_7Tr9jyuS6w&s', 'The epic journey to destroy the One Ring begins', 50, 4.9, 19.99),
    ('Gone Girl', 'Gillian Flynn', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8rAfWvUm6T1MNon1B2pzJMHhfvuRnrIV0zA&s', 'A psychological thriller about a mysterious disappearance', 60, 4.4, 15.49),
    ('Memoirs of a Geisha', 'Arthur Golden', 'https://m.media-amazon.com/images/M/MV5BMTYxMzM4NTEzOV5BMl5BanBnXkFtZTcwNDMwNjQzMw@@._V1_.jpg', 'A captivating story of a geisha life in Japan', 30, 4.7, 14.99),
    ('Life of Pi', 'Yann Martel', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXlFY5jTMo7HMcB8W2wUIHWm4bPOa3tbHeCQ&s', 'A young boy extraordinary survival story at sea', 40, 4.6, 13.99),
    ('The Shining', 'Stephen King', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn9BzzVeYaPy4oJeSqpufW3C-hxDFvzR8RSQ&s', 'A haunting tale of terror in an isolated hotel', 45, 4.5, 16.49),
    ('A Game of Thrones', 'George R.R. Martin', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKqtCoxo7Oahl0Niiz6OC3JNFwA8zaUyOXyA&s', 'The first book in the epic fantasy series A Song of Ice and Fire', 70, 4.8, 18.99);
`);

    res.json({ message: 'Database populated successfully' });
  } catch (error) {
    console.error('Error populating database:', error);
    res.status(500).json({ message: 'Error populating database' });
  }
};
