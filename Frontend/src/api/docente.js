import axiosInstance from "./axiosInstance";

export const crearTemporada = (data) => {
  return axiosInstance.post("/temporada/crear", data);
};

export const cerrarTemporada = (id) => {
  return axiosInstance.put(`/temporada/cerrar/${id}`);
};

export const obtenerDesempeno = (docenteId) => {
  return axiosInstance.get(`/docente/desempeno/${docenteId}`);
};
