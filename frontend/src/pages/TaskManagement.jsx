import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, getManagerTasks } from '../services/taskService';
import { getManagedUsers, getUsers } from '../services/userService';

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

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'Yüksek' },
  { value: 'Medium', label: 'Orta' },
  { value: 'Low', label: 'Düşük' },
];

const PRIORITY_LABELS = {
  High: 'Yüksek',
  Medium: 'Orta',
  Low: 'Düşük',
};

const STATUS_LABELS = {
  Pending: 'Beklemede',
  InProgress: 'Devam ediyor',
  Completed: 'Tamamlandı',
};

const STATUS_BADGES = {
  Pending: 'badge-muted',
  InProgress: 'badge-warning',
  Completed: 'badge-success',
};

const formatDate = (value, includeTime = false) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (includeTime) {
    return date.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
  }

  return date.toLocaleDateString('tr-TR', { dateStyle: 'medium' });
};

const TaskManagement = () => {
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());
  const [tasks, setTasks] = useState([]);
  const [managedUsers, setManagedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    selectedUserIds: [],
  });

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
  const isManager = roles.includes('Manager');
  const currentUserId = currentUser?.Id;

  const fetchTasks = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await getManagerTasks(currentUserId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Görevler alınamadı.', err);
      setError('Görevler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchAssignableUsers = useCallback(async () => {
    setUsersLoading(true);
    setFormError('');
    try {
      if (!currentUserId) {
        setManagedUsers([]);
        return;
      }

      if (isAdmin) {
        const { data } = await getUsers();
        const candidates = Array.isArray(data)
          ? data.filter((user) => user.Roles && user.Roles.some((role) => role.Name === 'User'))
          : [];
        setManagedUsers(candidates);
        if (candidates.length > 0) {
          setFormValues((prev) => {
            const preserved = prev.selectedUserIds.filter((id) => candidates.some((candidate) => candidate.Id === id));
            const nextSelection = preserved.length > 0 ? preserved : [candidates[0].Id];
            return { ...prev, selectedUserIds: nextSelection };
          });
        }
        return;
      }

      if (isManager) {
        const { data } = await getManagedUsers(currentUserId);
        const candidates = Array.isArray(data) ? data : [];
        setManagedUsers(candidates);
        if (candidates.length > 0) {
          setFormValues((prev) => {
            const preserved = prev.selectedUserIds.filter((id) => candidates.some((candidate) => candidate.Id === id));
            const nextSelection = preserved.length > 0 ? preserved : [candidates[0].Id];
            return { ...prev, selectedUserIds: nextSelection };
          });
        }
        return;
      }

      setManagedUsers([]);
    } catch (err) {
      console.error('Atanabilir kullanıcılar alınamadı.', err);
      setFormError('Atanabilir kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setUsersLoading(false);
    }
  }, [currentUserId, isAdmin, isManager]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    fetchTasks();
    fetchAssignableUsers();
  }, [currentUserId, fetchTasks, fetchAssignableUsers]);

  const updateFormValue = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserSelection = (event) => {
    const selected = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
    updateFormValue('selectedUserIds', selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!currentUserId) {
      setFormError('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    if (formValues.selectedUserIds.length === 0) {
      setFormError('En az bir kullanıcı seçmelisiniz.');
      return;
    }

    setIsSubmitting(true);
    // oluşturma işlemi
    try {
      const payload = {
        Title: formValues.title.trim(),
        Description: formValues.description.trim(),
        Priority: formValues.priority,
        DueDate: formValues.dueDate ? `${formValues.dueDate}T00:00:00` : null,
        ManagerId: currentUserId,
        UserIds: formValues.selectedUserIds,
      };

      if (!payload.Title) {
        setFormError('Görev başlığı zorunludur.');
        setIsSubmitting(false);
        return;
      }

      const { data } = await createTask(payload);
      const createdTask = data?.Task;

      if (createdTask) {
        setTasks((prev) => [createdTask, ...prev]);
      } else {
        await fetchTasks();
      }

      setFormValues((prev) => ({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        selectedUserIds: prev.selectedUserIds,
      }));
    } catch (err) {
      console.error('Görev oluşturulamadı.', err);
      setFormError('Görev oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // tablo ve form görünümü
  return (
    <div className="container">
      <h2>Görev Yönetimi</h2>
      <p className="page-subtitle">Ekip üyelerinize görevler atayın, durumlarını izleyin.</p>

      <div className="task-management-grid">
        <div className="task-form-card">
          <h3>Yeni Görev Oluştur</h3>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group form-group-full">
              <label>Görev Başlığı *</label>
              <input
                type="text"
                value={formValues.title}
                onChange={(event) => updateFormValue('title', event.target.value)}
                placeholder="Örn. Haftalık raporu hazırla"
                required
              />
            </div>
            <div className="form-group form-group-full">
              <label>Açıklama</label>
              <textarea
                value={formValues.description}
                onChange={(event) => updateFormValue('description', event.target.value)}
                rows={4}
                placeholder="Görev detaylarını paylaşabilirsiniz."
              />
            </div>
            <div className="form-group">
              <label>Öncelik</label>
              <select
                value={formValues.priority}
                onChange={(event) => updateFormValue('priority', event.target.value)}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Son Tarih</label>
              <input
                type="date"
                value={formValues.dueDate}
                onChange={(event) => updateFormValue('dueDate', event.target.value)}
              />
            </div>
            <div className="form-group form-group-full">
              <label>Görev Atanacak Kullanıcılar *</label>
              <select
                value={formValues.selectedUserIds.map(String)}
                onChange={handleUserSelection}
                disabled={usersLoading || managedUsers.length === 0}
                multiple
                size={Math.min(managedUsers.length, 8) || 4}
              >
                {managedUsers.map((user) => (
                  <option key={user.Id} value={user.Id}>
                    {user.FullName?.trim() || user.UserName}
                  </option>
                ))}
              </select>
              <small className="form-hint">
                Birden fazla kullanıcı seçmek için Ctrl (Windows) veya Cmd (Mac) tuşunu kullanın.
              </small>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || usersLoading}>
                {isSubmitting ? 'Görev oluşturuluyor...' : 'Görev Oluştur'}
              </button>
            </div>
          </form>
        </div>

        <div className="task-management__list">
          <h3>Atanan Görevler</h3>
          {error && <div className="alert alert-error">{error}</div>}
          {loading ? (
            <div className="empty-state">Görevler yükleniyor...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">Henüz atanan görev bulunmuyor.</div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => {
                const dueDate = formatDate(task.DueDate);
                const createdDate = formatDate(task.CreatedDate, true);

                return (
                  <div key={task.Id} className="task-card">
                    <div className="task-card__header">
                      <div>
                        <h3>{task.Title}</h3>
                        <span className="task-card__priority-chip">
                          {PRIORITY_LABELS[task.Priority] || task.Priority}
                        </span>
                      </div>
                      <span className="task-card__manager">
                        {task.AssignedByManagerName || 'Yönetici bilgisi yok'}
                      </span>
                    </div>
                    {task.Description && (
                      <p className="task-card__description">{task.Description}</p>
                    )}
                    <div className="task-card__meta">
                      {createdDate && <span>Oluşturulma: {createdDate}</span>}
                      {dueDate && <span>Son Tarih: {dueDate}</span>}
                    </div>
                    <div className="assignment-list">
                      {task.Assignments && task.Assignments.length > 0 ? (
                        task.Assignments.map((assignment) => {
                          const assignedDate = formatDate(assignment.AssignedDate, true);
                          const completedDate = formatDate(assignment.CompletedDate, true);
                          const statusClass = STATUS_BADGES[assignment.Status] || 'badge-muted';
                          const statusLabel = STATUS_LABELS[assignment.Status] || assignment.Status;

                          return (
                            <div key={assignment.AssignmentId} className="assignment-item">
                              <div className="assignment-item__info">
                                <strong>{assignment.UserName}</strong>
                                <span className="assignment-item__dates">
                                  {assignedDate && `Atama: ${assignedDate}`}
                                  {completedDate && ` • Tamamlandı: ${completedDate}`}
                                </span>
                              </div>
                              <span className={`badge ${statusClass}`}>{statusLabel}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="assignment-item assignment-item--empty">
                          Bu görev için atanmış kullanıcı bulunmuyor.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
