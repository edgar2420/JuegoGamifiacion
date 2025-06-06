import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  obtenerTemporadaActiva,
  obtenerHistorialTemporadas,
  crearTemporada,
  cerrarTemporada,
} from "../../api/temporada";
import Button from "../../components/Button";

const GestionTemporadasPage = () => {
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
    if (confirm("¿Estás seguro de cerrar esta temporada? Se evaluarán los retos.")) {
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
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Gestión de Temporadas</h1>

          <h2>Temporada activa</h2>
          {temporadaActiva ? (
            <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <p><strong>Nombre:</strong> {temporadaActiva.nombre}</p>
              <p><strong>Fecha inicio:</strong> {temporadaActiva.fecha_inicio}</p>
              <p><strong>Fecha fin:</strong> {temporadaActiva.fecha_fin}</p>
              <Button onClick={() => handleCerrarTemporada(temporadaActiva.id)}>Cerrar temporada</Button>
            </div>
          ) : (
            <p>No hay temporada activa.</p>
          )}

          <h2>Crear nueva temporada</h2>
          <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Fecha inicio:</label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Fecha fin:</label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Crear Temporada</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <h2>Historial de temporadas</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((temp) => (
                <tr key={temp.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td>{temp.nombre}</td>
                  <td>{temp.fecha_inicio}</td>
                  <td>{temp.fecha_fin}</td>
                  <td>{temp.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default GestionTemporadasPage;
