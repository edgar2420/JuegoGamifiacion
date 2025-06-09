import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";

const HistorialTareasPage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [estudianteId, setEstudianteId] = useState("");

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const res = await axiosInstance.get("/estudiantes/obtener");
      setEstudiantes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarTareas = async () => {
    try {
      if (estudianteId) {
        const res = await axiosInstance.get(`/tarea/estudiantes/${estudianteId}`);
        setTareas(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Historial de Tareas por Estudiante</h1>

          <div>
            <label>Seleccionar Estudiante:</label>
            <select
              value={estudianteId}
              onChange={(e) => setEstudianteId(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {estudiantes.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.nombre}
                </option>
              ))}
            </select>
            <Button onClick={cargarTareas}>Ver Tareas</Button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha Entrega</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td>{tarea.titulo}</td>
                  <td>{tarea.fecha_entrega}</td>
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

export default HistorialTareasPage;
