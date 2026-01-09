import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleForm from './pages/RoleForm';
import Roles from './pages/Roles';
import UserForm from './pages/UserForm';
import Users from './pages/Users';
import TaskManagement from './pages/TaskManagement';

const getStoredUser = () => {
  const rawUser = localStorage.getItem('user'); // localstorage'dan user bilgisi alınıyo
  if (!rawUser) {
    return null; // tarayicida saklı user var mı bakıoz
  }

  try {
    return JSON.parse(rawUser); // varsa parse edip döndürüoz bundan sonra artık yoksa login pageye atıyoz he varsa main pageye atıyoz
  } catch (error) {
    console.warn('Kullanıcı bilgileri çözümlenemedi.', error);
    return null;
  }
};

// route korumaları burda uygulanıyor. children içine konacak alt component temsilidir,
// allowed roles da hangi rollerin nereye girebileceğini belirtir
const PrivateRoute = ({ children, allowedRoles }) => { 
  const token = localStorage.getItem('token');
  if (!token) { // tam olarak burda giriş yapmış mı yapmamış mı eleman? yapmadıysan logine navige ediyoz
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) { // ilk bi girilen sayfaya rol kontrolü gerekiyo mu bakılıyo 
    // gerekiyosa kullanıcının rolleri alınıyo ve izin verilen rollerle karşılaştırılıyo
    // sıkıntı çıkarsa dashboarda atıyoz
    const user = getStoredUser();
    const userRoles = user?.Roles?.map((role) => role.Name) || [];
    const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));

    if (!isAuthorized) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={(
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            )}
          />
          <Route
            path="/tasks"
            element={(
              <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                <TaskManagement />
              </PrivateRoute>
            )}
          />
          <Route
            path="/users"
            element={(
              <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                <Users />
              </PrivateRoute>
            )}
          />
          <Route
            path="/users/new"
            element={(
              <PrivateRoute allowedRoles={['Admin']}>
                <UserForm />
              </PrivateRoute>
            )}
          />
          <Route
            path="/users/edit/:id"
            element={(
              <PrivateRoute allowedRoles={['Admin']}>
                <UserForm />
              </PrivateRoute>
            )}
          />
          <Route
            path="/roles"
            element={(
              <PrivateRoute allowedRoles={['Admin']}>
                <Roles />
              </PrivateRoute>
            )}
          />
          <Route
            path="/roles/new"
            element={(
              <PrivateRoute allowedRoles={['Admin']}>
                <RoleForm />
              </PrivateRoute>
            )}
          />
          <Route
            path="/roles/edit/:id"
            element={(
              <PrivateRoute allowedRoles={['Admin']}>
                <RoleForm />
              </PrivateRoute>
            )}
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
