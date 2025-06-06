import axiosInstance from "./axiosInstance";

export const obtenerTemporadaActiva = () => {
  return axiosInstance.get("/temporada/activa");
};

export const obtenerHistorialTemporadas = () => {
  return axiosInstance.get("/temporada/historial");
};

export const crearTemporada = (data) => {
    return axiosInstance.post("/temporada/crear", data);
}

export const cerrarTemporada = (id) => {
    return axiosInstance.post(`/temporada/cerrar/${id}`);
}