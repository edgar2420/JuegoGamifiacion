import { useEffect, useState } from "react";
import {
  obtenerTemporadaActiva,
  obtenerHistorialTemporadas,
  crearTemporada,
  cerrarTemporada,
  eliminarTemporada,
  actualizarTemporada,
  activarTemporada,
  desactivarTemporada, // ⚠️ asegúrate de tener esta función en api/temporada.js
} from "../../api/temporada";
import Button from "../../components/Button";

const TemporadasGestion = () => {
  const [temporadasActivas, setTemporadasActivas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const activaRes = await obtenerTemporadaActiva();
      setTemporadasActivas(Array.isArray(activaRes.data) ? activaRes.data : [activaRes.data]);

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
    const hoy = new Date().toISOString().split("T")[0];
    if (formData.fecha_inicio < hoy || formData.fecha_fin < hoy) {
      setError("No se pueden usar fechas anteriores a hoy");
      return;
    }

    try {
      if (editando) {
        await actualizarTemporada(formData.id, formData);
      } else {
        await crearTemporada(formData);
      }
      setFormData({ id: null, nombre: "", fecha_inicio: "", fecha_fin: "" });
      setEditando(false);
      setError("");
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("Error al guardar temporada");
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

  const handleEliminarTemporada = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta temporada?")) {
      try {
        await eliminarTemporada(id);
        await cargarDatos();
      } catch (err) {
        console.error(err);
        setError("Error al eliminar temporada");
      }
    }
  };

  const handleActivarTemporada = async (id) => {
    if (window.confirm("¿Activar esta temporada?")) {
      try {
        await activarTemporada(id);
        await cargarDatos();
      } catch (err) {
        console.error(err);
        setError("Error al activar temporada");
      }
    }
  };

  const handleDesactivarTemporada = async (id) => {
    if (window.confirm("¿Estás seguro de desactivar esta temporada?")) {
      try {
        await desactivarTemporada(id);
        await cargarDatos();
      } catch (err) {
        console.error(err);
        setError("Error al desactivar temporada");
      }
    }
  };

  const handleEditar = (temp) => {
    setFormData({
      id: temp.id,
      nombre: temp.nombre,
      fecha_inicio: temp.fecha_inicio.split("T")[0],
      fecha_fin: temp.fecha_fin.split("T")[0]
    });
    setEditando(true);
    setError("");
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Temporadas activas</h2>
      {temporadasActivas.length > 0 ? (
        temporadasActivas.map((temp) => (
          <div className="card mb-3" key={temp.id}>
            <div className="card-body">
              <h5 className="card-title">{temp.nombre}</h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Inicio:</strong> {formatearFecha(temp.fecha_inicio)}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Fin:</strong> {formatearFecha(temp.fecha_fin)}</p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button onClick={() => handleCerrarTemporada(temp.id)} className="btn btn-danger">
                  Cerrar temporada
                </Button>
                <Button onClick={() => handleDesactivarTemporada(temp.id)} className="btn btn-secondary">
                  Desactivar temporada
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-warning">No hay temporadas activas.</div>
      )}

      <h2 className="mb-4">{editando ? "Editar temporada" : "Crear nueva temporada"}</h2>
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
          {editando ? "Actualizar" : "Crear Temporada"}
        </Button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>

      <h2 className="mb-3">Historial de temporadas</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((temp) => (
              <tr key={temp.id}>
                <td>{temp.nombre}</td>
                <td>{formatearFecha(temp.fecha_inicio)}</td>
                <td>{formatearFecha(temp.fecha_fin)}</td>
                <td>
                  <span className={`badge ${temp.estado === 'activa' ? 'bg-success' : 'bg-secondary'}`}>
                    {temp.estado}
                  </span>
                </td>
                <td className="d-flex gap-2">
                  <Button className="btn btn-outline-primary btn-sm" onClick={() => handleEditar(temp)}>
                    Editar
                  </Button>
                  <Button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleActivarTemporada(temp.id)}
                  >
                    Activar
                  </Button>
                  <Button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleEliminarTemporada(temp.id)}
                    disabled={temp.estado === 'activa'}
                  >
                    Eliminar
                  </Button>
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
