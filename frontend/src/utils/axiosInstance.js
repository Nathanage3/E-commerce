import axios from 'axios';

const getAccessToken = () => {
  return localStorage.getItem('ecomUserAccess');
};
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('ecomUserRefresh');
  const response = await axios.post('/api/token/refresh/', {
    refresh: refreshToken,
  });
  if (response.data) {
    localStorage.setItem('ecomUserAccess', response.data.access);
    return response.data.access;
  }

  return null;
};
const logout = () => {
  localStorage.removeItem('ecomUser');
  localStorage.removeItem('ecomUserAccess');
  localStorage.removeItem('ecomUserRefresh');
};
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `JWT ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          logout();
        }
      } catch (err) {
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
