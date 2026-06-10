import axios from "../api/axios";
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems } =
    useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0)
    return (
      <div style={styles.empty}>
        <h2>Your cart is empty 🛒</h2>
        <button style={styles.btn} onClick={() => navigate("/products")}>
          Browse Products
        </button>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Cart ({totalItems} items)</h2>
      {cart.map((item) => (
        <div key={item._id} style={styles.row}>
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} style={styles.img} />
          )}
          <div style={styles.info}>
            <p style={styles.name}>{item.name}</p>
            <p style={styles.price}>₦{item.price.toLocaleString()} each</p>
          </div>
          <div style={styles.qty}>
            <button
              style={styles.qtyBtn}
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
            >
              −
            </button>
            <span style={styles.qtyNum}>{item.quantity}</span>
            <button
              style={styles.qtyBtn}
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <p style={styles.subtotal}>
            ₦{(item.price * item.quantity).toLocaleString()}
          </p>
          <button
            style={styles.removeBtn}
            onClick={() => removeFromCart(item._id)}
          >
            ✕
          </button>
        </div>
      ))}
      <div style={styles.summary}>
        <p style={styles.total}>Total: ₦{total.toLocaleString()}</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={styles.clearBtn} onClick={clearCart}>
            Clear Cart
          </button>
          <button
            style={styles.checkoutBtn}
            onClick={async () => {
              if (!window.confirm("Place this order?")) return;
              try {
                await Promise.all(
                  cart.map((item) =>
                    axios.post(`/products/${item._id}/reduce-stock`, {
                      quantity: item.quantity,
                    }),
                  ),
                );
                await axios.post("/orders", {
                  items: cart.map((item) => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl,
                  })),
                  total: cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                  ),
                });
                navigate("/orders");
                setTimeout(() => clearCart(), 100);
                toast.success("Order placed! 🎉");
              } catch (err: any) {
                toast.error(
                  err.response?.data?.message || "Failed to place order",
                );
              }
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: "800px", margin: "40px auto", padding: "24px" },
  heading: { color: "#1a1a2e", marginBottom: "24px" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 0",
    borderBottom: "1px solid #eee",
  },
  img: {
    width: "64px",
    height: "64px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  info: { flex: 1 },
  name: { fontWeight: "bold", color: "#1a1a2e", marginBottom: "4px" },
  price: { color: "#999", fontSize: "0.85rem" },
  qty: { display: "flex", alignItems: "center", gap: "8px" },
  qtyBtn: {
    width: "28px",
    height: "28px",
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  qtyNum: { minWidth: "24px", textAlign: "center", fontWeight: "bold" },
  subtotal: {
    minWidth: "80px",
    textAlign: "right",
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#ff4444",
    cursor: "pointer",
    fontSize: "1rem",
  },
  summary: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: { fontSize: "1.4rem", fontWeight: "bold", color: "#1a1a2e" },
  clearBtn: {
    padding: "10px 20px",
    background: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  checkoutBtn: {
    padding: "10px 24px",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  empty: { textAlign: "center", marginTop: "80px" },
  btn: {
    marginTop: "16px",
    padding: "12px 24px",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default CheckoutPage;
