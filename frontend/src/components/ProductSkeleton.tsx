import React from "react";

const ProductSkeleton = () => (
  <div style={styles.card}>
    <div style={styles.img} />
    <div style={styles.body}>
      <div style={{ ...styles.line, width: "70%" }} />
      <div style={{ ...styles.line, width: "40%" }} />
      <div style={{ ...styles.line, width: "50%" }} />
      <div style={styles.btnRow}>
        <div style={{ ...styles.btn }} />
        <div style={{ ...styles.btn }} />
      </div>
    </div>
  </div>
);

const shimmer: React.CSSProperties = {
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  borderRadius: "6px",
};

const styles: Record<string, React.CSSProperties> = {
  card: { border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" },
  img: { ...shimmer, width: "100%", height: "180px", borderRadius: 0 },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  line: { ...shimmer, height: "14px" },
  btnRow: { display: "flex", gap: "8px", marginTop: "4px" },
  btn: { ...shimmer, height: "32px", flex: 1 },
};

export default ProductSkeleton;
