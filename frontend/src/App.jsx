import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Landing from './pages/Landing';
import Events from './pages/Events';
import Contacts from './pages/Contacts';
import PublicInvite from './pages/PublicInvite';
import Login from './pages/Login';
import Register from './pages/Register';

import './App.css';


function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate(); 
  const location = useLocation();

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/'); 
  };

  const ProtectedLayout = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    return (
      <div className="app-container">
        <header className="app-header">
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <h1 className="app-title">🎉 EventFlow</h1>
          </Link>
          <button onClick={handleLogout} className="btn-logout">Выйти</button>
        </header>
        
        <nav className="app-nav">
          <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>Мои Мероприятия</Link>
          <Link to="/contacts" className={`nav-link ${location.pathname === '/contacts' ? 'active' : ''}`}>База Контактов</Link>
        </nav>

        {children}
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/events" replace />} />
      <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/events" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/events" replace />} />
      <Route path="/invite/:eventId/:guestId" element={<PublicInvite />} />
      <Route path="/events" element={<ProtectedLayout><Events /></ProtectedLayout>} />
      <Route path="/contacts" element={<ProtectedLayout><Contacts /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}