import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  deleteUser,
  getManagedUsers,
  getUsers,
  toggleUserStatus,
} from '../services/userService';

const readCurrentUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Kullanıcı bilgileri çözümlenemedi.', error);
    return null;
  }
};

const Users = () => {
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleStorage = () => {
      setCurrentUser(readCurrentUser());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const roles = useMemo(() => {
    if (!currentUser?.Roles) {
      return [];
    }
    return currentUser.Roles.map((role) => role.Name);
  }, [currentUser]);

  const isAdmin = roles.includes('Admin');
  const currentUserId = currentUser?.Id;
  const pageSubtitle = isAdmin
    ? 'Sistem kullanıcılarını buradan görüntüleyip yönetebilirsiniz.'
    : 'Size bağlı kullanıcıları görüntüleyin.';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const response = isAdmin
          ? await getUsers()
          : await getManagedUsers(currentUserId);
        setUsers(response.data);
      } catch (err) {
        console.error('Kullanıcılar alınamadı.', err);
        setError('Kullanıcı listesi yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, currentUserId]);

  const handleDelete = async (id) => {
    if (!isAdmin) {
      return;
    }
    const confirmed = window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(id);
      if (isAdmin) {
        const { data } = await getUsers();
        setUsers(data);
      }
    } catch (err) {
      console.error('Kullanıcı silinemedi.', err);
      setError('Kullanıcı silinirken bir hata oluştu.');
    }
  };

  const handleToggleStatus = async (id) => {
    if (!isAdmin) {
      return;
    }

    try {
      await toggleUserStatus(id);
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Kullanıcı durumu güncellenemedi.', err);
      setError('Kullanıcı durumu değiştirilirken bir hata oluştu.');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Kullanıcı Yönetimi</h2>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
        {isAdmin && <Link to="/users/new" className="btn btn-primary">Yeni Kullanıcı Ekle</Link>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="empty-state">Veriler yükleniyor...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">Henüz görüntülenecek kullanıcı bulunmuyor.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Departman</th>
                <th>Yönetici</th>
                <th>Roller</th>
                <th>Durum</th>
                {isAdmin && <th>İşlemler</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.Id}>
                  <td>{user.UserName}</td>
                  <td>{user.FullName || '-'}</td>
                  <td>{user.Email}</td>
                  <td>{user.Department || '-'}</td>
                  <td>{user.ManagerName || '-'}</td>
                  <td>{user.Roles && user.Roles.length > 0 ? user.Roles.map((role) => role.Name).join(', ') : 'Rol yok'}</td>
                  <td>
                    <span className={`badge ${user.IsActive ? 'badge-success' : 'badge-muted'}`}>
                      {user.IsActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="table-actions">
                      <Link to={`/users/edit/${user.Id}`} className="btn btn-sm btn-secondary">Düzenle</Link>
                      <button onClick={() => handleToggleStatus(user.Id)} className="btn btn-sm btn-warning">
                        {user.IsActive ? 'Pasifleştir' : 'Aktifleştir'}
                      </button>
                      <button onClick={() => handleDelete(user.Id)} className="btn btn-sm btn-danger">Sil</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
