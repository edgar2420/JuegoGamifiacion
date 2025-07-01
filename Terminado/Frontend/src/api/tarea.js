import axiosInstance from "./axiosInstance";

export const registrarTarea = (data) => {
  return axiosInstance.post("/tarea/registrar", data);
};

export const obtenerTodasLasTareas = () => {
  return axiosInstance.get("/tarea/todas");
};
