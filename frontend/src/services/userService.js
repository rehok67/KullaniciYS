import apiClient from './api';

export const getUsers = (params = {}) => {
  return apiClient.get('/users', { params });
};

export const getUser = (id) => {
  return apiClient.get(`/users/${id}`);
};

export const getManagedUsers = (managerId) => {
  return apiClient.get(`/users/managed-by/${managerId}`);
};

export const createUser = (registerPayload) => {
  return apiClient.post('/users', registerPayload);
};

export const updateUser = (id, updatePayload) => {
  return apiClient.put(`/users/${id}`, updatePayload);
};

export const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}`);
};

export const toggleUserStatus = (id) => {
  return apiClient.post(`/users/${id}/toggle-status`);
};
