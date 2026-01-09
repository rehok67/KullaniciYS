import apiClient from './api';

export const getUserTasks = (userId) => {
  return apiClient.get(`/tasks/user/${userId}`);
};

export const completeUserTask = (taskId, userId) => {
  return apiClient.post(`/tasks/${taskId}/complete`, { UserId: userId });
};

export const getManagerTasks = (managerId) => {
  return apiClient.get(`/tasks/manager/${managerId}`);
};

export const createTask = (payload) => {
  return apiClient.post('/tasks', payload);
};
