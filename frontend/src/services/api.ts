import axios from "axios";

const api = axios.create({
  baseURL: "https://testeadvogado.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const mensagem =
      error.response?.data?.message || error.response?.data?.erro || "";

    if (
      status === 401 ||
      status === 403 ||
      mensagem.includes("inativo") ||
      mensagem.includes("expirada")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
