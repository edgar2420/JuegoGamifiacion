import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";

const AsignarTareasPage = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    fecha_inicio: "",
    fecha_fin: ""
  });
  const [error, setError] = useState("");
  const [tareas, setTareas] = useState([]);
  const [docenteId, setDocenteId] = useState(null);

  useEffect(() => {
    obtenerPerfilDocente();
    cargarTareas();
  }, []);

  const obtenerPerfilDocente = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axiosInstance.get(`/docentes/obtenerPerfil/${user.id}`);
      setDocenteId(res.data.id);
    } catch (err) {
      console.error("Error al obtener perfil del docente:", err);
      setError("Error al obtener perfil del docente");
    }
  };

  const cargarTareas = async () => {
    try {
      const res = await axiosInstance.get("/tareas/todas");
      setTareas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!docenteId) {
        alert("No se pudo obtener el perfil del docente.");
        return;
      }

      await axiosInstance.post("/tareas/crear-docente", {
        ...formData,
        docenteId
      });

      setFormData({ titulo: "", fecha_inicio: "", fecha_fin: "" });
      setError("");
      alert("Tarea asignada a todos los estudiantes correctamente");
      await cargarTareas();
    } catch (err) {
      console.error(err);
      setError("Error al asignar tarea");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Asignar Tareas</h1>

          <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
            <div>
              <label>Título:</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Fecha de inicio:</label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Fecha de fin:</label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Asignar Tarea</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <h2>Listado de Tareas Asignadas</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha de inicio</th>
                <th>Fecha de entrega</th>
                <th>Estudiante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr
                  key={tarea.id}
                  style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}
                >
                  <td>{tarea.titulo}</td>
                  <td>{tarea.fecha_inicio}</td>
                  <td>{tarea.fecha_entrega}</td>
                  <td>{tarea.estudiante?.nombre}</td>
                  <td>{tarea.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default AsignarTareasPage;
