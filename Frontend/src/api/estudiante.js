import axiosInstance from "./axiosInstance";

export const obtenerPerfil = async (id) => {
  const response = await axiosInstance.get(`http://localhost:3000/estudiantes/perfil/${id}`);
  return response.data;
};


export const obtenerTareasPorEstudiante = (id) => {
  return axiosInstance.get(`/tarea/estudiantes/${id}`);
};

export const obtenerLogrosPorEstudiante = (id) => {
  return axiosInstance.get(`/logro/estudiantes/${id}`);
};
