const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.get("/", (req, res) => {
  res.send("Nellie Designs API is running.");
});

// READ all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY product_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// READ one product
app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE product_id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// CREATE product
app.post("/api/products", async (req, res) => {
  const { name, description, price, stock_qty, category } = req.body;

  if (!name || !price || !stock_qty) {
    return res.status(400).json({
      error: "Name, price, and stock quantity are required"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products 
      (name, description, price, stock_qty, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, description, price, stock_qty, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// UPDATE product
app.put("/api/products/:id", async (req, res) => {
  const { name, description, price, stock_qty, category } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           stock_qty = $4,
           category = $5
       WHERE product_id = $6
       RETURNING *`,
      [name, description, price, stock_qty, category, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE product_id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// CREATE custom request
app.post("/api/custom-requests", async (req, res) => {
  const {
    occasion,
    preferred_colors,
    flower_types,
    budget_range,
    notes
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO custom_requests
      (occasion, preferred_colors, flower_types, budget_range, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [occasion, preferred_colors, flower_types, budget_range, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create custom request" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
