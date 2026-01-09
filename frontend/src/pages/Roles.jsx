import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteRole, getRoles } from '../services/roleService';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await getRoles();// roller api den çekiliyoz
      setRoles(data); // roller state'ini güncelliyoruz
    } catch (err) {
      console.error('Roller alınamadı.', err);
      setError('Roller yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bu rolü silmek istediğinizden emin misiniz?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteRole(id);
      await fetchRoles();
    } catch (err) {
      console.error('Rol silinemedi.', err);
      setError(err.response?.data?.Message || 'Rol silinirken bir hata oluştu.');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Rol Yönetimi</h2>
          <p className="page-subtitle">Sistem rollerini ve ilgili kullanıcı sayılarını yönetin.</p>
        </div>
        <Link to="/roles/new" className="btn btn-primary">Yeni Rol Ekle</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="empty-state">Veriler yükleniyor...</div>
      ) : roles.length === 0 ? (
        <div className="empty-state">Henüz tanımlanmış rol bulunmuyor.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rol Adı</th>
                <th>Açıklama</th>
                <th>Kullanıcı Sayısı</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.Id}>
                  <td>{role.Name}</td>
                  <td>{role.Description || '-'}</td>
                  <td>
                    <span className="badge badge-muted">{role.UserCount}</span>
                  </td>
                  <td className="table-actions">
                    <Link to={`/roles/edit/${role.Id}`} className="btn btn-sm btn-secondary">Düzenle</Link>
                    <button onClick={() => handleDelete(role.Id)} className="btn btn-sm btn-danger">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Roles;
