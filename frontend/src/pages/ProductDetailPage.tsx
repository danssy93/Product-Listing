import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../constants/categories";
import toast from "react-hot-toast";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}

const empty: Product = {
  name: "",
  description: "",
  price: 0,
  category: "",
  imageUrl: "",
  stock: 0,
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const [product, setProduct] = useState<Product>(empty);
  const [editing, setEditing] = useState(isNew);
  const [form, setForm] = useState<Product>(empty);
  const { addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>(
    {},
  );

  useEffect(() => {
    if (!isNew) {
      axios.get(`/products/${id}`).then(({ data }) => {
        setProduct(data);
        setForm(data);
      });
    }
  }, [id]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Product, string>> = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Please select a category";
    if (form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (form.stock < 0) newErrors.stock = "Stock cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      ...form,
      imageUrl: form.imageUrl?.trim() || undefined,
    };
    try {
      if (isNew) {
        await axios.post("/products", payload);
      } else {
        await axios.put(`/products/${id}`, payload);
      }
      navigate("/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async () => {
    await axios.delete(`/products/${id}`);
    navigate("/products");
  };

  if (editing)
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>
          {isNew ? "Add New Product" : "Edit Product"}
        </h2>

        {(
          [
            { field: "name", label: "Product Name", type: "text" },
            { field: "description", label: "Description", type: "text" },
            // { field: "category", label: "Category", type: "text" },
            { field: "imageUrl", label: "Image URL (optional)", type: "text" },
          ] as const
        ).map(({ field, label, type }) => (
          <div key={field} style={styles.fieldGroup}>
            <label style={styles.label}>{label}</label>
            <input
              style={styles.input}
              type={type}
              placeholder={`Enter ${label.toLowerCase()}`}
              value={form[field] || ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>
        ))}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Category</label>
          <select
            style={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">-- Select a category --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.name && <span style={styles.errorText}>{errors.name}</span>}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Price (₦)</label>
          <input
            style={styles.input}
            type="number"
            placeholder="e.g. 5000"
            min={0}
            value={form.price === 0 ? "" : form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
          {errors.name && <span style={styles.errorText}>{errors.name}</span>}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Stock Quantity</label>
          <input
            style={styles.input}
            type="number"
            placeholder="e.g. 20"
            min={0}
            value={form.stock === 0 ? "" : form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
          {errors.name && <span style={styles.errorText}>{errors.name}</span>}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button style={styles.saveBtn} onClick={handleSave}>
            Save Product
          </button>
          {!isNew && (
            <button style={styles.cancelBtn} onClick={() => setEditing(false)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} style={styles.img} />
      )}
      <h2 style={styles.heading}>{product.name}</h2>
      <p style={styles.category}>{product.category}</p>
      <p style={styles.desc}>{product.description}</p>
      <p style={styles.price}>₦{product.price?.toLocaleString()}</p>
      <p style={styles.stock}>In stock: {product.stock}</p>
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button
          style={styles.cartBtn}
          disabled={cartLoading}
          onClick={async () => {
            setCartLoading(true);
            try {
              addToCart({
                _id: product._id!,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              });
              toast.success("Added to cart!");
            } finally {
              setCartLoading(false);
            }
          }}
        >
          {cartLoading ? "Adding..." : "Add to Cart"}
        </button>
        {token && (
          <button style={styles.editBtn} onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        {token && (
          <button style={styles.deleteBtn} onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: "700px", margin: "40px auto", padding: "24px" },
  heading: { color: "#1a1a2e", marginBottom: "8px" },
  img: {
    width: "100%",
    maxHeight: "360px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  category: { color: "#999", marginBottom: "8px" },
  desc: { color: "#444", marginBottom: "12px", lineHeight: "1.6" },
  price: {
    color: "#e94560",
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  stock: { color: "#666", marginBottom: "16px" },
  errorText: { color: "#e94560", fontSize: "0.78rem", marginTop: "4px" },
  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  saveBtn: {
    padding: "10px 24px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "10px 24px",
    background: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cartBtn: {
    padding: "10px 24px",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  editBtn: {
    padding: "10px 24px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "10px 24px",
    background: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ProductDetailPage;
