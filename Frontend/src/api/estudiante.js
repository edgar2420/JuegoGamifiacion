import axiosInstance from "./axiosInstance";

export const obtenerPerfil = (id) => {
  return axiosInstance.get(`/estudiantes/perfil/${id}`);
};

export const obtenerTareasPorEstudiante = (id) => {
  return axiosInstance.get(`/tarea/estudiantes/${id}`);
};

export const obtenerLogrosPorEstudiante = (id) => {
  return axiosInstance.get(`/logro/estudiantes/${id}`);
};
