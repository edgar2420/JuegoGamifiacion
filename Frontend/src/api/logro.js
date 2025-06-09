import axiosInstance from "./axiosInstance";

export const obtenerLogros = () => {
  return axiosInstance.get("/logros/obtener");
};

export const crearLogro = (data) => {
  return axiosInstance.post("/logros/crear", data);
};

export const eliminarLogro = (id) => {
  return axiosInstance.delete(`/logros/eliminar/${id}`);
};
