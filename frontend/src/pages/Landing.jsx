import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Database,
  Server,
  Globe,
  Terminal,
  CheckCircle2,
  Cpu,
  Activity,
  Zap,
  Github,
  Layout,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.page}>

      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate("/")}>
            <div style={styles.logoIcon}>
              <Zap size={18} fill="#6366f1" color="#6366f1" />
            </div>
            <span style={styles.logoText}>EventFlow</span>
          </div>
          <div style={styles.nav}>
            <button style={styles.navLink} onClick={() => navigate("/login")}>
              Войти
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/register")}
            >
              Регистрация
            </button>
          </div>
        </div>
      </header>

      <main style={styles.container}>
        
        <section style={styles.hero}>
          <div style={styles.badge}> Project for Portfolio</div>
          <h1 style={styles.title}>
            Управляйте событиями <br />
            <span style={styles.gradientText}>без хаоса и таблиц</span>
          </h1>
          <p style={styles.heroSubText}>
            "Fullstack-платформа для организации мероприятий — прямо в
            браузере!"
          </p>

          <div style={styles.heroActionArea}>
            <div style={styles.demoCardEnhanced}>
              <div style={styles.demoHeader}>
                <Terminal size={14} color="#818cf8" />
                <span>Demo Access</span>
              </div>
              <div style={styles.demoBody}>
                <div style={styles.creds}>
                  <div style={styles.credRow}>
                    <span style={styles.label}>Login:</span>{" "}
                    <code>demo@eventflow.ru</code>
                  </div>
                  <div style={styles.credRow}>
                    <span style={styles.label}>Pass:</span>{" "}
                    <code>testdrive2026</code>
                  </div>
                </div>
                <button
                  style={styles.ctaDemo}
                  onClick={() => navigate("/login?demo=true")}
                >
                  Запустить Demo <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.centeredHeader}>
            <Cpu size={28} color="#6366f1" />
            <h2 style={styles.sectionTitle}>Технологическая реализация</h2>
          </div>
          <div style={styles.grid}>
            <TechCard
              id={1}
              icon={<Globe color="#60a5fa" />}
              title="React Frontend"
              text="Hooks, Context API, Axios Interceptors для обработки 401 ошибок."
              hovered={hoveredCard === 1}
              setHovered={setHoveredCard}
              code="axios.interceptors.response.use..."
            />
            <TechCard
              id={2}
              icon={<Server color="#34d399" />}
              title="Node.js & Express"
              text="RESTful API, архитектура контроллеров и кастомные middleware."
              hovered={hoveredCard === 2}
              setHovered={setHoveredCard}
              code="router.post('/login', authController);"
            />
            <TechCard
              id={3}
              icon={<Database color="#f87171" />}
              title="MongoDB Atlas"
              text="Схемы Mongoose, Population для глубоких связей между моделями."
              hovered={hoveredCard === 3}
              setHovered={setHoveredCard}
              code="eventSchema.populate('guests');"
            />
            <TechCard
              id={4}
              icon={<Shield color="#fbbf24" />}
              title="JWT Security"
              text="Bcrypt для хеширования и Bearer-стратегия защиты маршрутов."
              hovered={hoveredCard === 4}
              setHovered={setHoveredCard}
              code="jwt.verify(token, process.env.SECRET);"
            />
          </div>
        </section>

        <div style={styles.splitGrid}>
          <section style={styles.featureBox}>
            <h3 style={styles.blockTitle}>
              <Layout size={20} style={{ marginRight: 10, color: "#6366f1" }} />{" "}
              Функционал
            </h3>
            <div style={styles.featureItems}>
              <FeatureItem emoji="🔐" text="JWT Auth & Private Routes" />
              <FeatureItem emoji="📝" text="Полный CRUD мероприятий" />
              <FeatureItem emoji="🌐" text="Публичные RSVP-страницы" />
              <FeatureItem emoji="⚡" text="PATCH-обновление статусов" />
              <FeatureItem emoji="📊" text="Live-статистика гостей" />
            </div>
          </section>

          <section style={styles.logicBox}>
            <h3 style={styles.blockTitle}>
              <Layers size={20} style={{ marginRight: 10, color: "#6366f1" }} />{" "}
              Архитектура данных
            </h3>
            <div style={styles.diagramContainer}>
              <div style={styles.diagNode}>User</div>
              <ChevronRight size={16} color="#475569" />
              <div style={styles.diagNode}>Event</div>
              <ChevronRight size={16} color="#475569" />
              <div style={styles.diagNode}>Guest</div>
              <ChevronRight size={16} color="#475569" />
              <div style={styles.diagNode}>Contact</div>
            </div>
            <div style={styles.callout}>
              <Activity size={16} color="#818cf8" />
              <span>
                Эта архитектура позволяет масштабировать приложение и вести
                аналитику без дублирования данных в базе.
              </span>
            </div>
          </section>
        </div>

        
        <section style={styles.finalSection}>
          <div style={styles.finalCard}>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 36px)",
                marginBottom: "15px",
              }}
            >
              Готовы изучить проект?
            </h2>
            <p
              style={{
                color: "#94a3b8",
                marginBottom: "40px",
                maxWidth: "500px",
                margin: "0 auto 40px",
              }}
            >
              10+ функций, 3 связанные модели данных, полностью адаптивный
              интерфейс.
            </p>


            <div style={styles.finalActions}>
              <button
                style={styles.primaryBtnLarge}
                onClick={() => navigate("/login?demo=true")}
              >
                Запустить Demo
              </button>
              <button
                style={styles.githubBtn}
                onClick={() =>
                  window.open(
                    "https://github.com/SovaD/event-flow-app.git",
                    "_blank",
                  )
                }
              >
                <Github size={20} /> Посмотреть код
              </button>
            </div>
          </div>
          <p style={styles.copyright}>© 2026 Fullstack Developer Portfolio</p>
        </section>
      </main>
    </div>
  );
}



const TechCard = ({ id, icon, title, text, code, hovered, setHovered }) => (
  <div
    style={{
      ...styles.card,
      transform: hovered ? "translateY(-8px)" : "translateY(0)",
      borderColor: hovered ? "#6366f1" : "#1e293b",
    }}
    onMouseEnter={() => setHovered(id)}
    onMouseLeave={() => setHovered(null)}
  >
    <div style={styles.cardIcon}>{icon}</div>
    <h4 style={styles.cardTitle}>{title}</h4>
    <p style={styles.cardText}>{text}</p>
    {hovered && (
      <div style={styles.miniCode}>
        <code>{code}</code>
      </div>
    )}
  </div>
);

const FeatureItem = ({ emoji, text }) => (
  <div style={styles.featureItem}>
    <span style={styles.emoji}>{emoji}</span>
    <span style={{ color: "#cbd5e1", fontSize: "15px" }}>{text}</span>
  </div>
);

// --- СТИЛИ ---

const styles = {
  page: {
    backgroundColor: "#020617",
    color: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
  },
  header: {
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    backgroundColor: "rgba(2, 6, 23, 0.8)",
    backdropFilter: "blur(12px)",
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoIcon: { background: "#1e293b", padding: "8px", borderRadius: "10px" },
  logoText: { fontSize: "20px", fontWeight: "800" },
  nav: { display: "flex", gap: "15px" },
  navLink: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontWeight: "600",
  },
  primaryBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },

  hero: { textAlign: "center", padding: "100px 0 80px" },
  badge: {
    display: "inline-block",
    padding: "6px 16px",
    background: "rgba(99, 102, 241, 0.1)",
    color: "#818cf8",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "24px",
    border: "1px solid rgba(99, 102, 241, 0.2)",
  },
  title: {
    fontSize: "clamp(40px, 8vw, 72px)",
    fontWeight: "900",
    lineHeight: 1.1,
    marginBottom: "24px",
    letterSpacing: "-0.04em",
  },
  gradientText: {
    background: "linear-gradient(to right, #818cf8, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubText: {
    color: "#94a3b8",
    fontSize: "clamp(16px, 2vw, 20px)",
    maxWidth: "700px",
    margin: "0 auto 48px",
    lineHeight: "1.6",
  },

  heroActionArea: { display: "flex", justifyContent: "center" },
  demoCardEnhanced: {
    width: "100%",
    maxWidth: "550px",
    background: "#0f172a",
    borderRadius: "20px",
    border: "1px solid #1e293b",
    overflow: "hidden",
    textAlign: "left",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
  },
  demoHeader: {
    background: "#1e293b",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "700",
  },
  demoBody: {
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  creds: { display: "flex", flexDirection: "column", gap: "8px" },
  credRow: { fontSize: "14px" },
  label: { color: "#64748b", marginRight: "8px" },
  ctaDemo: {
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    color: "#fff",
    border: "none",
    padding: "16px 28px",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "0.3s transform ease",
  },

  section: { padding: "100px 0" },
  centeredHeader: { textAlign: "center", marginBottom: "60px" },
  sectionTitle: { fontSize: "36px", fontWeight: "800", marginBottom: "10px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#0f172a",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid #1e293b",
    transition: "all 0.3s ease",
  },
  cardIcon: { marginBottom: "24px" },
  cardTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "12px" },
  cardText: { fontSize: "15px", color: "#94a3b8", lineHeight: 1.6 },
  miniCode: {
    marginTop: "20px",
    background: "#020617",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#34d399",
    fontFamily: "monospace",
    border: "1px solid #1e293b",
  },

  splitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    margin: "40px 0",
  },
  featureBox: {
    background: "rgba(30, 41, 59, 0.3)",
    padding: "40px",
    borderRadius: "28px",
    border: "1px solid #1e293b",
  },
  blockTitle: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
  },
  featureItems: { display: "flex", flexDirection: "column", gap: "20px" },
  featureItem: { display: "flex", alignItems: "center", gap: "15px" },
  emoji: {
    background: "#1e293b",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },

  logicBox: { padding: "20px" },
  diagramContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  diagNode: {
    background: "#6366f1",
    padding: "10px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
  },
  callout: {
    display: "flex",
    gap: "16px",
    padding: "24px",
    background: "rgba(99, 102, 241, 0.05)",
    borderRadius: "20px",
    border: "1px solid rgba(99, 102, 241, 0.1)",
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: 1.6,
  },

  finalSection: { textAlign: "center", padding: "120px 0 60px" },
  finalCard: {
    background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
    padding: "80px 40px",
    borderRadius: "40px",
    border: "1px solid #1e293b",
  },
  finalActions: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  primaryBtnLarge: {
    background: "#fff",
    color: "#020617",
    padding: "18px 48px",
    borderRadius: "14px",
    fontWeight: "800",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
  },
  githubBtn: {
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "18px 48px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "18px",
    border: "1px solid #1e293b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  copyright: { marginTop: "60px", color: "#475569", fontSize: "14px" },
};
