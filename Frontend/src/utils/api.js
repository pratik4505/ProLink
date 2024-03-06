import axios from "axios";

const BASE_URL =import.meta.env.VITE_SERVER_URL;

const authInterceptor = (config) => {
  const userDataString = localStorage.getItem("userData");
 
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    const accessToken = userData.token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
};

export const API = axios.create({
    baseURL: BASE_URL,
  });

API.interceptors.request.use(authInterceptor);