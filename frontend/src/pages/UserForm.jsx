import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createUser,
  getUser,
  getUsers as fetchUsers,
  updateUser,
} from '../services/userService';
import { getRoles } from '../services/roleService';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [roleIds, setRoleIds] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [roles, setRoles] = useState([]);
  const [managerId, setManagerId] = useState('');
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, managersResponse, adminsResponse] = await Promise.all([
          getRoles(),
          fetchUsers({ role: 'Manager' }),
          fetchUsers({ role: 'Admin' }),
        ]);

        setRoles(rolesResponse.data);

        const managerCandidates = [...managersResponse.data];
        adminsResponse.data.forEach((admin) => {
          if (!managerCandidates.some((manager) => manager.Id === admin.Id)) {
            managerCandidates.push(admin);
          }
        });

        managerCandidates.sort((a, b) => {
          const left = a.FullName || a.UserName || '';
          const right = b.FullName || b.UserName || '';
          return left.localeCompare(right, 'tr');
        });

        setManagers(managerCandidates);
        if (!isEditMode && managerCandidates.length > 0) {
          setManagerId(String(managerCandidates[0].Id));
        }

        if (isEditMode) {
          const { data } = await getUser(id);
          setUserName(data.UserName);
          setFullName(data.FullName || '');
          setEmail(data.Email);
          setPhone(data.Phone || '');
          setDepartment(data.Department || '');
          setIsActive(data.IsActive);
          setRoleIds(data.Roles ? data.Roles.map((role) => role.Id) : []);
          setManagerId(data.ManagerId ? String(data.ManagerId) : '');
        }
      } catch (err) {
        console.error('Veriler alınamadı.', err);
        setError('Form verileri yüklenemedi. Lütfen tekrar deneyin.');
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const userRoleId = roles.find((role) => role.Name === 'User')?.Id;
  const hasUserRoleSelected = userRoleId
    ? (roleIds.length === 0 ? !isEditMode : roleIds.includes(userRoleId))
    : !isEditMode;

  const handleRoleChange = (event) => {
    const selected = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
    setRoleIds(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const managerIdValue = managerId ? Number(managerId) : null;

    if (hasUserRoleSelected && !managerIdValue) {
      setError('User rolündeki kullanıcılar için yönetici seçmelisiniz.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateUser(Number(id), {
          FullName: fullName,
          Email: email,
          Phone: phone,
          Department: department,
          IsActive: isActive,
          RoleIds: roleIds,
          ManagerId: managerIdValue,
        });
      } else {
        const registerPayload = {
          UserName: userName,
          Email: email,
          Password: password,
          FullName: fullName,
          Phone: phone,
          Department: department,
          ManagerId: managerIdValue,
        };

        const { data } = await createUser(registerPayload);

        if (roleIds.length > 0 && data && data.UserId) {
          await updateUser(data.UserId, {
            FullName: fullName,
            Email: email,
            Phone: phone,
            Department: department,
            IsActive: true,
            RoleIds: roleIds,
            ManagerId: managerIdValue,
          });
        }
      }

      navigate('/users');
    } catch (err) {
      console.error('Kullanıcı kaydedilemedi.', err);
      setError('Kullanıcı kaydedilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>{isEditMode ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Kullanıcı Adı *</label>
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            required
            disabled={isEditMode}
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
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {!isEditMode && (
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
        )}

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

        <div className="form-group">
          <label>Yönetici{hasUserRoleSelected ? ' *' : ''}</label>
          <select
            value={managerId}
            onChange={(event) => setManagerId(event.target.value)}
            required={hasUserRoleSelected}
          >
            <option value="">Yönetici seçin</option>
            {managers.map((manager) => (
              <option key={manager.Id} value={manager.Id}>
                {manager.FullName?.trim() || manager.UserName}
              </option>
            ))}
          </select>
          <small className="form-hint">Görevi takip edecek yöneticiyi seçin.</small>
        </div>

        <div className="form-group">
          <label>Roller</label>
          <select value={roleIds.map(String)} onChange={handleRoleChange} multiple size={Math.min(roles.length, 6) || 3}>
            {roles.map((role) => (
              <option key={role.Id} value={role.Id}>
                {role.Name}
              </option>
            ))}
          </select>
          <small className="form-hint">Birden fazla rol seçmek için Ctrl (Windows) veya Cmd (Mac) tuşunu kullanın.</small>
        </div>

        {isEditMode && (
          <div className="form-group form-group-inline">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              Kullanıcı aktif
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Oluştur'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/users')}>
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
