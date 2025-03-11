import axios from "axios";

const stance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
})



stance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
export default stance