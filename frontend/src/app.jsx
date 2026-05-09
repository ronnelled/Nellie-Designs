import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ManageProducts from "./pages/ManageProducts";

function App() {
  return (
    <>
      <header className="header">
        <h1>Nellie Designs</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/manage">Manage Products</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/manage" element={<ManageProducts />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Nellie Designs. Handmade pipe cleaner bouquets.</p>
      </footer>
    </>
  );
}

export default App;
