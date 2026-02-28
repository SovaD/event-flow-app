import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, UserPlus, AlertCircle } from "lucide-react"; // Иконки для солидности

export default function Register({ setAuth }) {
  
   const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/auth/register`,
        formData,
      );
      localStorage.setItem("token", res.data.token);
      setAuth(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ошибка регистрации. Попробуйте другой email.",
      );
    }
  };

  return (
    <div style={styles.authWrapper}>
      <div style={styles.authCard}>
        <div style={styles.glow}></div>

        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <UserPlus size={28} color="#818cf8" />
          </div>
          <h2 style={styles.title}>Создать аккаунт</h2>
          <p style={styles.subtitle}>Добро пожаловать в Event Manager</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form style={styles.authForm} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <User style={styles.inputIcon} size={18} />
            <input
              type="text"
              style={styles.authInput}
              placeholder="Ваше имя"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail style={styles.inputIcon} size={18} />
            <input
              type="email"
              style={styles.authInput}
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock style={styles.inputIcon} size={18} />
            <input
              type="password"
              style={styles.authInput}
              placeholder="Пароль (от 6 символов)"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Зарегистрироваться
          </button>
        </form>

        <div style={styles.authFooter}>
          Уже есть аккаунт?{" "}
          <Link to="/login" style={styles.authLink}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#020617",
    padding: "20px",
  },
  authCard: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: "-50px",
    right: "-50px",
    width: "150px",
    height: "150px",
    background: "rgba(99, 102, 241, 0.15)",
    filter: "blur(50px)",
    borderRadius: "50%",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconCircle: {
    width: "60px",
    height: "60px",
    background: "rgba(99, 102, 241, 0.1)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#f8fafc",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "13px",
    marginBottom: "20px",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#475569",
  },
  authInput: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  submitBtn: {
    marginTop: "10px",
    padding: "14px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s",
    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
  },
  authFooter: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#94a3b8",
  },
  authLink: {
    color: "#818cf8",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "5px",
  },
};
