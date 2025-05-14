import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/dashboard';

export const getDashboardStats = () => {
  return axios.get(`${API_BASE_URL}/stats`);
};

export const getSexDistribution = () => {
  return axios.get(`${API_BASE_URL}/sex-distribution`);
};
