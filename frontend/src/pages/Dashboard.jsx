import React, { useEffect, useState } from 'react';
import { getDashboardStats, getRecentUsers } from '../services/dashboardService';
import { completeUserTask, getUserTasks } from '../services/taskService';

// yine kullanici bilgilerini localStoragedan okuma fonksiyonu
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

const PRIORITY_LABELS = {
  Low: 'Düşük',
  Medium: 'Orta',
  High: 'Yüksek',
};

const STATUS_LABELS = {
  Pending: 'Beklemede',
  InProgress: 'Devam ediyor',
  Completed: 'Tamamlandı',
};

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());
  const [stats, setStats] = useState(null); // dashboard istatistikleri
  const [recentUsers, setRecentUsers] = useState([]); // son kaydolan kullanıcılar
  const [overviewError, setOverviewError] = useState(''); // genel dashboard hatası
  const [overviewLoading, setOverviewLoading] = useState(false); // genel dashboard yükleme durumu
  const [tasks, setTasks] = useState([]); // kullanıcı görevleri
  const [tasksLoading, setTasksLoading] = useState(false); // görevler yükleniyor durumu
  const [taskError, setTaskError] = useState(''); // görevler hatası
  const [completingTaskIds, setCompletingTaskIds] = useState({}); // tamamlanmakta olan görevlerin ID'leri
  useEffect(() => {
    const handleStorage = () => {
      setCurrentUser(readCurrentUser());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // kullanıcı rolleri ve kontroller
  const userRoles = currentUser?.Roles ? currentUser.Roles.map((role) => role.Name) : [];
  const isAdmin = userRoles.includes('Admin');
  const isManager = userRoles.includes('Manager');
  const isStandardUser = userRoles.includes('User') && !isAdmin && !isManager;
  const currentUserId = currentUser?.Id;

  const fetchOverview = async () => {
    setOverviewLoading(true);
    setOverviewError('');
    try {
      const [statsResponse, recentUsersResponse] = await Promise.all([
        getDashboardStats(),
        getRecentUsers(),
      ]);

      setStats(statsResponse.data);
      setRecentUsers(recentUsersResponse.data);
    } catch (error) {
      console.error('Dashboard verileri alınamadı.', error);
      setOverviewError('Dashboard verileri yüklenirken bir hata oluştu.');
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchTasks = async (userId) => {
    if (!userId) {
      return;
    }

    setTasksLoading(true);
    setTaskError('');
    try {
      const { data } = await getUserTasks(userId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Görevler alınamadı.', error);
      setTaskError('Görevler yüklenirken bir hata oluştu.');
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isManager) {
      fetchOverview();
    }
  }, [isAdmin, isManager]);

  useEffect(() => {
    if (isStandardUser && currentUserId) {
      fetchTasks(currentUserId);
    }
  }, [isStandardUser, currentUserId]);

  const handleCompleteTask = async (taskId) => {
    if (!currentUserId) {
      return;
    }

    setCompletingTaskIds((prev) => ({ ...prev, [taskId]: true }));
    setTaskError('');
    try {
      await completeUserTask(taskId, currentUserId);
      await fetchTasks(currentUserId);
    } catch (error) {
      console.error('Görev tamamlanırken hata oluştu.', error);
      setTaskError('Görev tamamlanırken bir hata oluştu.');
    } finally {
      setCompletingTaskIds((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  if (!currentUser) {
    return (
      <div className="container">
        <h2>Kontrol Paneli</h2>
        <div className="alert alert-error">Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.</div>
      </div>
    );
  }

  const displayName = currentUser.FullName?.trim() || currentUser.UserName || 'Kullanıcı';
  const roleLabel = userRoles.length > 0 ? userRoles.join(', ') : 'Rol atanmamış';
  const pageTitle = isStandardUser ? 'Görev Paneli' : 'Kontrol Paneli';
  const pageSubtitle = isStandardUser
    ? 'Size atanan görevleri görüntüleyin ve tamamlayın.'
    : 'Sistemin genel durumunu ve son aktiviteleri görüntüleyin.';

  const lastLogin = formatDate(currentUser.LastLoginDate, true);
  const createdDate = formatDate(currentUser.CreatedDate);

  return (
    <div className="container">
      <h2>{pageTitle}</h2>
      <p className="page-subtitle">{pageSubtitle}</p>

      <div className="user-summary">
        <div>
          <p className="user-summary__greeting">Merhaba, {displayName}</p>
          <p className="user-summary__roles">{roleLabel}</p>
        </div>
        <div className="user-summary__meta">
          <span><strong>Email:</strong> {currentUser.Email}</span>
          {currentUser.Department && <span><strong>Departman:</strong> {currentUser.Department}</span>}
          {createdDate && <span><strong>Kayıt Tarihi:</strong> {createdDate}</span>}
          {lastLogin && <span><strong>Son Giriş:</strong> {lastLogin}</span>}
        </div>
      </div>

      {isStandardUser ? (
        <>
          {taskError && <div className="alert alert-error">{taskError}</div>}
          {tasksLoading ? (
            <div className="empty-state">Görevler yükleniyor...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">Şu anda size atanmış görev bulunmuyor.</div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => {
                const assignment = task.Assignments && task.Assignments.length > 0 ? task.Assignments[0] : null;
                const status = assignment?.Status || 'Pending';
                const isCompleted = status === 'Completed';
                const dueDate = formatDate(task.DueDate);
                const completedDate = assignment?.CompletedDate ? formatDate(assignment.CompletedDate, true) : null;
                const badgeClass = status === 'Completed'
                  ? 'badge-success'
                  : status === 'InProgress'
                    ? 'badge-warning'
                    : 'badge-muted';
                const statusLabel = STATUS_LABELS[status] || status;
                const priorityLabel = PRIORITY_LABELS[task.Priority] || task.Priority;

                return (
                  <div
                    key={task.Id}
                    className={`task-card${isCompleted ? ' task-card--completed' : ''}`}
                  >
                    <div className="task-card__header">
                      <h3>{task.Title}</h3>
                      <span className={`badge ${badgeClass}`}>
                        {statusLabel}
                      </span>
                    </div>
                    {task.Description && (
                      <p className="task-card__description">{task.Description}</p>
                    )}
                    <div className="task-card__meta">
                      <span>Öncelik: {priorityLabel}</span>
                      {task.AssignedByManagerName && <span>Yönetici: {task.AssignedByManagerName}</span>}
                      {dueDate && <span>Son Tarih: {dueDate}</span>}
                      {completedDate && <span>Tamamlandı: {completedDate}</span>}
                    </div>
                    {!isCompleted && (
                      <div className="task-card__actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompleteTask(task.Id)}
                          disabled={Boolean(completingTaskIds[task.Id])}
                        >
                          {completingTaskIds[task.Id] ? 'Tamamlanıyor...' : 'Görevi tamamla'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          {overviewError && <div className="alert alert-error">{overviewError}</div>}

          {overviewLoading && !stats ? (
            <div className="empty-state">Dashboard verileri hazırlanıyor...</div>
          ) : stats ? (
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Toplam Kullanıcı</h3>
                <p>{stats.TotalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Aktif Kullanıcı</h3>
                <p>{stats.ActiveUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Admin Sayısı</h3>
                <p>{stats.AdminCount}</p>
              </div>
              <div className="stat-card">
                <h3>Toplam Rol</h3>
                <p>{stats.TotalRoles}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">Gösterilecek istatistik bulunmuyor.</div>
          )}
          <div className="card-panel">
            <div className="card-panel__header">
              <h3>Son Kaydolan Kullanıcılar</h3>
              <span className="card-panel__hint">En yeni 10 kullanıcı listelenir.</span>
            </div>
            {recentUsers.length === 0 ? (
              <div className="empty-state">Henüz yeni kullanıcı bulunmuyor.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Kullanıcı Adı</th>
                      <th>Ad Soyad</th>
                      <th>Email</th>
                      <th>Oluşturulma Tarihi</th>
                      <th>Roller</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.Id}>
                        <td>{user.UserName}</td>
                        <td>{user.FullName || '-'}</td>
                        <td>{user.Email}</td>
                        <td>{user.CreatedDate ? formatDate(user.CreatedDate) : '-'}</td>
                        <td>
                          {user.Roles && user.Roles.length > 0
                            ? user.Roles.map((role) => role.Name).join(', ')
                            : 'Rol yok'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
