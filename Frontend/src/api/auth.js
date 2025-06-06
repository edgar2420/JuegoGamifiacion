import axiosInstance from "./axiosInstance";

export const login = (correo, contrasena) => {
  return axiosInstance.post("/auth/login", {
    correo,
    contrasena,
  });
};
export const register = (nombre, correo, contrasena) => {
  return axiosInstance.post("/auth/register", {
    nombre,
    correo,
    contrasena,
  });
};