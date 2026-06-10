import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { username, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/products" style={styles.brand}>
        🛒 ProductApp
      </Link>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>
          Products
        </Link>
        <Link to="/checkout" style={styles.link}>
          Cart{" "}
          {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
        </Link>
        <Link to="/orders" style={styles.link}>
          My Orders
        </Link>
        {username ? (
          <>
            <span style={styles.user}>👤 {username}</span>
            <button onClick={handleLogout} style={styles.btn}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#1a1a2e",
    color: "#fff",
  },
  brand: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: "1.2rem",
    textDecoration: "none",
  },
  links: { display: "flex", alignItems: "center", gap: "16px" },
  link: { color: "#fff", textDecoration: "none" },
  badge: {
    background: "#e94560",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 7px",
    fontSize: "0.75rem",
    marginLeft: "4px",
  },
  user: { color: "#aaa", fontSize: "0.9rem" },
  btn: {
    background: "#e94560",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;
