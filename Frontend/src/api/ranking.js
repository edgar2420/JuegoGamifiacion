import axiosInstance from "./axiosInstance";

export const obtenerRankingActual = () => {
  return axiosInstance.get("/ranking/actual");
};

export const obtenerRankingPorTemporada = (temporadaId) => {
  return axiosInstance.get(`/ranking/temporada/${temporadaId}`);
};

export const actualizarRanking = (data) => {
  return axiosInstance.post("/ranking/actualizar", data);
};
export const obtenerRankingPorEstudiante = (estudianteId) => {
  return axiosInstance.get(`/ranking/estudiante/${estudianteId}`);
};
export const obtenerRanking = (docenteId) => {
    return axiosInstance.get(`/ranking/docente/${docenteId}`);
}
