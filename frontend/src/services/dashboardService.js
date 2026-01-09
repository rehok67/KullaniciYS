import apiClient from './api';

export const getDashboardStats = () => {
  return apiClient.get('/dashboard/stats');
};

export const getRecentUsers = () => {
  return apiClient.get('/dashboard/recent-users');
};
