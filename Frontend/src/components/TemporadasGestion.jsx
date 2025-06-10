import { useEffect, useState } from "react";
import {
  obtenerTemporadaActiva,
  obtenerHistorialTemporadas,
  crearTemporada,
  cerrarTemporada,
} from "../api/temporada";
import Button from "./Button";

const TemporadasGestion = () => {
  const [temporadaActiva, setTemporadaActiva] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const activaRes = await obtenerTemporadaActiva();
      setTemporadaActiva(activaRes.data);

      const historialRes = await obtenerHistorialTemporadas();
      setHistorial(historialRes.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar temporadas");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await crearTemporada(formData);
      setFormData({
        nombre: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
      setError("");
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("Error al crear temporada");
    }
  };

  const handleCerrarTemporada = async (id) => {
    if (window.confirm("¿Estás seguro de cerrar esta temporada? Se evaluarán los retos.")) {
      try {
        await cerrarTemporada(id);
        await cargarDatos();
      } catch (err) {
        console.error(err);
        setError("Error al cerrar temporada");
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Temporada activa</h2>
      {temporadaActiva ? (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{temporadaActiva.nombre}</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Fecha inicio:</strong> {temporadaActiva.fecha_inicio}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Fecha fin:</strong> {temporadaActiva.fecha_fin}</p>
              </div>
            </div>
            <Button 
              onClick={() => handleCerrarTemporada(temporadaActiva.id)}
              className="btn btn-danger"
            >
              Cerrar temporada
            </Button>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">No hay temporada activa.</div>
      )}

      <h2 className="mb-4">Crear nueva temporada</h2>
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha inicio:</label>
          <input
            type="date"
            className="form-control"
            name="fecha_inicio"
            value={formData.fecha_inicio}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha fin:</label>
          <input
            type="date"
            className="form-control"
            name="fecha_fin"
            value={formData.fecha_fin}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" className="btn btn-primary">
          Crear Temporada
        </Button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>

      <h2 className="mb-3">Historial de temporadas</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((temp) => (
              <tr key={temp.id}>
                <td>{temp.nombre}</td>
                <td>{temp.fecha_inicio}</td>
                <td>{temp.fecha_fin}</td>
                <td>
                  <span className={`badge ${temp.estado === 'Activa' ? 'bg-success' : 'bg-secondary'}`}>
                    {temp.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemporadasGestion;