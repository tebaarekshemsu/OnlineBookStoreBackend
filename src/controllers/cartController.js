import Cart from '../models/cart.js';
import Book from '../models/book.js';

export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.available_pieces < quantity) {
      return res.status(400).json({ message: 'Not enough books available' });
    }

    const cartItem = await Cart.addItem(userId, bookId, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.getItems(userId);
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedItem = await Cart.updateItemQuantity(id, quantity);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.removeItem(id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.clearCart(userId);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};