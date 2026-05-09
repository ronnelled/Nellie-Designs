import { useEffect, useState } from "react";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_qty: "",
    category: ""
  });

  function loadProducts() {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      price: "",
      stock_qty: "",
      category: ""
    });
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock_qty) {
      alert("Please enter product name, price, and stock quantity.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then(() => {
        loadProducts();
        resetForm();
      })
      .catch((err) => console.error("Error saving product:", err));
  }

  function handleEdit(product) {
    setEditingId(product.product_id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_qty: product.stock_qty,
      category: product.category
    });
  }

  function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then(() => loadProducts())
      .catch((err) => console.error("Error deleting product:", err));
  }

  return (
    <section>
      <h2>Management / CRUD Page</h2>
      <p>Create, read, update, and delete bouquet products.</p>

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="stock_qty"
          type="number"
          placeholder="Stock quantity"
          value={form.stock_qty}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Product" : "Create Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <div className="card-grid">
        {products.map((product) => (
          <div className="card" key={product.product_id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock_qty}</p>
            <p><strong>Category:</strong> {product.category}</p>

            <button onClick={() => handleEdit(product)}>Edit</button>
            <button className="danger" onClick={() => handleDelete(product.product_id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ManageProducts;
