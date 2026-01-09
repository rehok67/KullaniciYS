import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRole, getRole, updateRole } from '../services/roleService';

const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      return; // Yeni rol ekleme modundaysa veri çekmeye gerek yok bundan edit mode
    }

    const fetchRole = async () => {
      try {
        const { data } = await getRole(id); // Mevcut rol verisini alıyoz
        setName(data.Name); // formu dolduruyoz
        setDescription(data.Description || ''); 
      } catch (err) {
        console.error('Rol alınamadı.', err);
        setError('Rol bilgileri yüklenemedi.');
      }
    };

    fetchRole();
  }, [id, isEditMode]);

  // Form submit işlemi
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload = {
      Name: name,
      Description: description,
    };

    try {
      if (isEditMode) {
        await updateRole(id, payload);
      } else {
        await createRole(payload);
      }

      navigate('/roles');
    } catch (err) {
      console.error('Rol kaydedilemedi.', err);
      setError(err.response?.data || 'Rol kaydedilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>{isEditMode ? 'Rolü Düzenle' : 'Yeni Rol Ekle'}</h2>
      {error && <div className="alert alert-error">{String(error)}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Rol Adı *</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-group form-group-full">
          <label>Açıklama</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Oluştur'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/roles')}>
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
