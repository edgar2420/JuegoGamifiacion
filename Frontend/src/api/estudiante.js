import axiosInstance from "./axiosInstance";

export const obtenerPerfil = (id) => {
  return axiosInstance.get(`/estudiante/perfil/${id}`);
};

export const obtenerTareasPorEstudiante = (id) => {
  return axiosInstance.get(`/tarea/estudiante/${id}`);
};

export const obtenerLogrosPorEstudiante = (id) => {
  return axiosInstance.get(`/logro/estudiante/${id}`);
};
