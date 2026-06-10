import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await axios.post(endpoint, { username, password });
      if (!isRegister) {
        login(data.token, data.username);
        navigate("/products");
      } else {
        setIsRegister(false);
        toast.success("Account created! Please log in.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.btn} type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p style={styles.toggle}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <span style={styles.link} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Login" : " Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f0f2f5",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: { marginBottom: "24px", textAlign: "center", color: "#1a1a2e" },
  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: { color: "#e94560", marginBottom: "12px", textAlign: "center" },
  toggle: { textAlign: "center", marginTop: "16px", color: "#666" },
  link: { color: "#e94560", cursor: "pointer", fontWeight: "bold" },
};

export default LoginPage;
