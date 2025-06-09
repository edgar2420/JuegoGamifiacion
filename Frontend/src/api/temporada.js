import axiosInstance from "./axiosInstance";

export const obtenerTemporadaActiva = () => {
  return axiosInstance.get("/temporadas/activa");
};

export const obtenerHistorialTemporadas = () => {
  return axiosInstance.get("/temporadas/historial");
};

export const crearTemporada = (data) => {
    return axiosInstance.post("/temporadas/crear", data);
}

export const cerrarTemporada = (id) => {
    return axiosInstance.post(`/temporadas/cerrar/${id}`);
}