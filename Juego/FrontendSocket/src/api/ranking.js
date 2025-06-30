import axiosInstance from "./axiosInstance";

export const getRankingActual = async () => {
  const res = await axiosInstance.get("/ranking/actual");
  return res.data;
};

export const obtenerRankingActual = () => {
  return axiosInstance.get("/ranking/actual");
};

export const obtenerRankingPorTemporada = (temporadaId) => {
  return axiosInstance.get(`/ranking/por-temporada/${temporadaId}`);
};

export const actualizarRanking = (data) => {
  return axiosInstance.post("/ranking/actualizar", data);
};

export const obtenerRankingPorEstudiante = (estudianteId) => {
  return axiosInstance.get(`/ranking/estudiante/${estudianteId}`);
};

export const obtenerRanking = (docenteId) => {
  return axiosInstance.get(`/ranking/docente/${docenteId}`);
};
