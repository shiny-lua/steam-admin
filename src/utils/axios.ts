import axios from 'axios';
// config
import { BACKEND_URL } from '../config-global';

// ----------------------------------------------------------------------
const axiosInstance = axios.create({ baseURL: `${BACKEND_URL}/api/admin` });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('Axios error:', error);
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;
