import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  return (
    <section>
      <h2>Product Dashboard</h2>
      <p>Browse available Nellie Designs bouquet products.</p>

      <div className="card-grid">
        {products.map((product) => (
          <div className="card" key={product.product_id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stock_qty}</p>
            <p><strong>Price:</strong> ${product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
