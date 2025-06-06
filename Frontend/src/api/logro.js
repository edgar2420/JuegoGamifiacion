import axiosInstance from "./axiosInstance";

export const obtenerLogros = () => {
  return axiosInstance.get("/logro/obtener");
};

export const crearLogro = (data) => {
  return axiosInstance.post("/logro/crear", data);
};

export const eliminarLogro = (id) => {
  return axiosInstance.delete(`/logro/eliminar/${id}`);
};
