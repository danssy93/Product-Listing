import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../constants/categories";
import ProductSkeleton from "../components/ProductSkeleton";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addToCart } = useCart();
  const { token } = useAuth();
  const [cartLoadingId, setCartLoadingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params: any = {};

      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      const { data } = await axios.get("/products", { params });

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Products</h2>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          style={styles.input}
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          placeholder="Min price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Max price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button style={styles.btn} onClick={fetchProducts}>
          Search
        </button>
        <button
          style={{ ...styles.btn, background: "#ccc", color: "#333" }}
          onClick={() => {
            setSearch("");
            setCategory("");
            setMinPrice("");
            setMaxPrice("");
            setTimeout(fetchProducts, 0);
          }}
        >
          Clear
        </button>
        {token && (
          <Link to="/products/new" style={styles.addBtn}>
            + Add Product
          </Link>
        )}
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {loading ? (
          Array.from({ length: 6 }, (_, i) => <ProductSkeleton key={i} />)
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} style={styles.card}>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.name} style={styles.img} />
              )}

              <div style={styles.cardBody}>
                <h3 style={styles.name}>{p.name}</h3>

                <p style={styles.category}>{p.category}</p>

                <p style={styles.price}>₦{p.price.toLocaleString()}</p>

                <p
                  style={{
                    ...styles.stock,
                    color:
                      p.stock === 0
                        ? "#ff4444"
                        : p.stock <= 5
                          ? "#f0a500"
                          : "#27ae60",
                  }}
                >
                  {p.stock === 0
                    ? "❌ Out of stock"
                    : p.stock <= 5
                      ? `⚠️ Only ${p.stock} left`
                      : `✅ In stock: ${p.stock}`}
                </p>

                <div style={styles.cardActions}>
                  <Link to={`/products/${p._id}`} style={styles.viewBtn}>
                    View
                  </Link>

                  <button
                    style={{
                      ...styles.cartBtn,
                      opacity: cartLoadingId === p._id ? 0.6 : 1,
                    }}
                    disabled={p.stock === 0 || cartLoadingId === p._id}
                    onClick={async () => {
                      setCartLoadingId(p._id);
                      try {
                        addToCart({
                          _id: p._id,
                          name: p.name,
                          price: p.price,
                          imageUrl: p.imageUrl,
                        });
                        toast.success("Added to cart!");
                      } finally {
                        setCartLoadingId(null);
                      }
                    }}
                  >
                    {cartLoadingId === p._id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  heading: { marginBottom: "20px", color: "#1a1a2e" },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "24px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
  },
  btn: {
    padding: "10px 20px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#e94560",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  stock: { fontSize: "0.82rem", fontWeight: "600", marginBottom: "10px" },
  img: { width: "100%", height: "180px", objectFit: "cover" },
  cardBody: { padding: "16px" },
  name: { fontWeight: "bold", marginBottom: "4px", color: "#1a1a2e" },
  category: { color: "#999", fontSize: "0.85rem", marginBottom: "8px" },
  price: { color: "#e94560", fontWeight: "bold", marginBottom: "12px" },
  cardActions: { display: "flex", gap: "8px" },
  viewBtn: {
    padding: "8px 14px",
    border: "1px solid #1a1a2e",
    borderRadius: "6px",
    color: "#1a1a2e",
    textDecoration: "none",
    fontSize: "0.85rem",
  },
  cartBtn: {
    padding: "8px 14px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
};

export default ProductsPage;
