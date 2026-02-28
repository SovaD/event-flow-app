
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Zap, Key, Mail, AlertCircle } from "lucide-react";

export default function Login({ setAuth }) {
  
   const API_URL = process.env.REACT_APP_API_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  
  const theme = {
    bg: '#0f172a',
    card: '#1e293b',
    accent: '#6366f1',
    border: '#334155'
  };

  
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setEmail("demo@eventflow.ru");
      setPassword("testdrive2026");
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", response.data.token);
      if (setAuth) setAuth(true);
      window.location.href = '/events'; 
    } catch (error) {
      setMessage(error.response?.data?.message || "Ошибка авторизации");
      setLoading(false);
    }
  };

  return (
    <div style={{ ...loginStyles.wrapper, backgroundColor: theme.bg }}>
      <header style={loginStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate("/")}>
          <Zap size={24} color={theme.accent} fill={theme.accent} />
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#fff' }}>EventFlow</span>
        </div>
      </header>

      <div style={{ ...loginStyles.card, backgroundColor: theme.card, borderColor: theme.border }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#fff' }}>С возвращением</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '24px', fontSize: '14px' }}>
          Введите данные для управления вашими событиями
        </p>

        <form onSubmit={handleLogin} style={loginStyles.form}>
          <div style={loginStyles.inputGroup}>
            <Mail size={18} style={loginStyles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={loginStyles.input}
            />
          </div>

          <div style={loginStyles.inputGroup}>
            <Key size={18} style={loginStyles.icon} />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={loginStyles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={{ ...loginStyles.submitBtn, backgroundColor: theme.accent }}>
            {loading ? "Вход..." : "Войти в систему"}
          </button>
        </form>

        {message && (
          <div style={loginStyles.error}>
            <AlertCircle size={16} /> {message}
          </div>
        )}

        <p style={loginStyles.footerText}>
          Нет аккаунта? <span onClick={() => navigate("/register")} style={{ color: theme.accent, cursor: 'pointer' }}>Зарегистрироваться</span>
        </p>
      </div>
    </div>
  );
}

const loginStyles = {
  
  wrapper: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  header: { position: 'absolute', top: 0, width: '80%', padding: '24px 5%', display: 'flex', justifyContent: 'space-between' },
  card: { width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '24px', border: '1px solid', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '12px', color: '#64748b' },
  input: { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '16px', outline: 'none' },
  submitBtn: { padding: '14px', borderRadius: '10px', border: 'none', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px', transition: 'opacity 0.2s' },
  error: { marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
  footerText: { marginTop: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }
};