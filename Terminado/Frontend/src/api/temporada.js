import axiosInstance from "./axiosInstance";

export const obtenerTemporadaActiva = () => {
  return axiosInstance.get("/temporadas/activa");
};

export const obtenerHistorialTemporadas = () => {
  return axiosInstance.get("/temporadas/historial");
};

export const crearTemporada = (data) => {
    return axiosInstance.post("/temporadas/crear", data);
};

export const cerrarTemporada = (id) => {
    return axiosInstance.post(`/temporadas/cerrar/${id}`);
};

export const eliminarTemporada = (id) => {
    return axiosInstance.delete(`/temporadas/eliminar/${id}`);
};

export const actualizarTemporada = (id, data) => {
    return axiosInstance.put(`/temporadas/editar/${id}`, data);
};

export const activarTemporada = (id) => {
    return axiosInstance.post(`/temporadas/activar/${id}`);
};  

export const desactivarTemporada = (id) => {
    return axiosInstance.post(`/temporadas/desactivar/${id}`);
};
