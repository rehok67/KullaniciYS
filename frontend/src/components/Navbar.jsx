import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Kullanıcı bilgileri okunamadı.', error);
    return null;
  }
};

const Navbar = () => {
  const navigate = useNavigate(); //yönlerdirme aracı oluşturuyoz
  const location = useLocation(); // hangi sayfada olduğu tutuyoz
  const [token, setToken] = useState(() => localStorage.getItem('token'));// hafızaya alıoz
  const [user, setUser] = useState(getStoredUser); 

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUser(getStoredUser());
  }, [location]); // sayfa değiştiğinde token ve user bilgilerini güncelliyoz

  const roles = useMemo(() => {
    if (!user?.Roles) {
      return [];
    }
    return user.Roles.map((role) => role.Name);
  }, [user]);
// kullanıcı rolleri değiştiğinde rollerin isimlerini alıoz
  const isAdmin = roles.includes('Admin');
  const isManager = roles.includes('Manager');
  const canManageUsers = isAdmin || isManager;

  const displayName = user?.FullName?.trim() || user?.UserName || 'Kullanıcı';
  const roleLabel = roles.length > 0 ? roles.join(', ') : 'Rol atanmamış';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Yönetim Paneli</Link>
      </div>
      {token ? (
        <div className="navbar-session">
          <div className="navbar-links">
            <Link to="/dashboard">Dashboard</Link>
            {canManageUsers && <Link to="/users">Kullanıcılar</Link>}
            {(isManager || isAdmin) && <Link to="/tasks">Görev Yönetimi</Link>}
            {isAdmin && <Link to="/roles">Roller</Link>}
          </div>
          <div className="navbar-actions">
            {user && (
              <div className="navbar-user">
                <span className="navbar-user__name">{displayName}</span>
                <span className="navbar-user__roles">{roleLabel}</span>
              </div>
            )}
            <button onClick={handleLogout} className="btn btn-logout" type="button">Çıkış Yap</button>
          </div>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Giriş Yap</Link>
          <Link to="/register">Kayıt Ol</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
