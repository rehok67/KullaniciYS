import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      await register({
        UserName: userName,
        Email: email,
        Password: password,
        FullName: fullName,
        Phone: phone,
        Department: department,
      });

      setFeedback({ type: 'success', message: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Kayıt başarısız.', err);
      const message = err.response?.data || 'Kayıt işlemi sırasında bir hata oluştu.';
      setFeedback({ type: 'error', message: String(message) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Yeni Hesap Oluştur</h2>
        <p className="auth-subtitle">Kendi hesabınızı oluşturun ve yönetim paneline erişin.</p>

        {feedback.message && (
          <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {feedback.message}
          </div>
        )}

        <div className="form-group">
          <label>Kullanıcı Adı *</label>
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre *</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>Ad Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Departman</label>
          <input
            type="text"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </button>
      </form>
    </div>
  );
};

export default Register;
