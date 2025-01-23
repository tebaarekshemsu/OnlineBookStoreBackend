const express = require("express");
import Book from "../models/book";
import User from "../models/user";
import Order from "../models/order";
import adminAuthMiddleware from "../middleware/adminAuth";

const router = express.Router();

router.use(adminAuthMiddleware);

// Add a new book
router.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding book", error: error.message });
  }
});

// Remove a book
router.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await book.destroy();
    res.status(200).json({ message: "Book removed successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error removing book", error: error.message });
  }
});

// Update book details
router.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await book.update(req.body);
    res.status(200).json(book);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating book", error: error.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Update order status
router.put("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.update({ status: req.body.status });
    res.status(200).json(order);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating order status", error: error.message });
  }
});

// Get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "firstName", "lastName", "email"] },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

module.exports = router;
