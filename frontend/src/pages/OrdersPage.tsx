import React, { useEffect, useState } from "react";
import axios from "../api/axios";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/orders")
      .then(({ data }) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error(
          "Orders fetch error:",
          err.response?.status,
          err.response?.data,
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.msg}>Loading orders...</p>;
  if (orders.length === 0)
    return (
      <div style={styles.empty}>
        <p style={{ fontSize: "3rem" }}>📦</p>
        <h3>No orders yet</h3>
        <p style={{ color: "#999" }}>Your order history will appear here</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.orderId}>
              Order #{order._id.slice(-6).toUpperCase()}
            </span>
            <span style={styles.date}>
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span style={styles.total}>₦{order.total.toLocaleString()}</span>
          </div>
          <div style={styles.items}>
            {order.items.map((item, i) => (
              <div key={i} style={styles.item}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} style={styles.img} />
                )}
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemQty}>x{item.quantity}</span>
                <span style={styles.itemPrice}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: "800px", margin: "40px auto", padding: "24px" },
  heading: { color: "#1a1a2e", marginBottom: "24px" },
  card: {
    border: "1px solid #eee",
    borderRadius: "12px",
    marginBottom: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    background: "#f9f9f9",
    borderBottom: "1px solid #eee",
  },
  orderId: { fontWeight: "bold", color: "#1a1a2e" },
  date: { color: "#999", fontSize: "0.85rem" },
  total: { color: "#e94560", fontWeight: "bold" },
  items: {
    padding: "12px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  item: { display: "flex", alignItems: "center", gap: "12px" },
  img: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    objectFit: "cover",
  },
  itemName: { flex: 1, color: "#333" },
  itemQty: { color: "#999", fontSize: "0.85rem" },
  itemPrice: { fontWeight: "bold", color: "#1a1a2e" },
  msg: { textAlign: "center", marginTop: "60px", color: "#999" },
  empty: { textAlign: "center", marginTop: "80px" },
};

export default OrdersPage;
