import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/api/auth/login", { username, password });
  if (response.data.token) {
    localStorage.setItem("admin_token", response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("admin_token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("admin_token");
};

