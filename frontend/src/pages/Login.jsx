import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
// gerekli stateler
// kullanıcı adı, şifre, hata mesajı veriyo
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data } = await login({ UserName: userName, Password: password });
// login fonksiyonu çağrılıyo apiye istek atıyoz
      if (!data.Success) {
        setError(data.Message || 'Giriş başarısız.'); // başarısızsa hata mesajı set ediliyo
        return;
      }

      localStorage.setItem('token', data.Token); // başarılıysa token ve user bilgileri localstorage'a kaydediliyo
      if (data.User) {
        localStorage.setItem('user', JSON.stringify(data.User)); 
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Giriş başarısız.', err);
      setError('Giriş sırasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // burda form tasarımı var
  return (
    <div className="container auth-container"> 
      <form onSubmit={handleSubmit} className="auth-form"> 
        <h2>Hoş geldiniz</h2>
        <p className="auth-subtitle">Lütfen kullanıcı adı ve şifrenizle giriş yapın.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Kullanıcı Adı</label>
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default Login;
