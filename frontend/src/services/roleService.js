import apiClient from './api';

export const getRoles = () => {
  return apiClient.get('/roles');
};

export const getRole = (id) => {
  return apiClient.get(`/roles/${id}`);
};

export const createRole = (roleData) => {
  return apiClient.post('/roles', roleData);
};

export const updateRole = (id, roleData) => {
  return apiClient.put(`/roles/${id}`, roleData);
};

export const deleteRole = (id) => {
  return apiClient.delete(`/roles/${id}`);
};
