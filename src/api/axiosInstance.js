import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Ajoute automatiquement le token JWT s'il existe (utile plus tard pour Admin/Contributeur)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;