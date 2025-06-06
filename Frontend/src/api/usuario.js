import axiosInstance from "./axiosInstance";

export const obtenerUsuarios = () => {
  return axiosInstance.get("/usuarios/obtener");
};

export const crearUsuario = (data) => {
  return axiosInstance.post("/usuarios/crear", data);
};

export const eliminarUsuario = (id) => {
  return axiosInstance.delete(`/usuarios/eliminar/${id}`);
};
