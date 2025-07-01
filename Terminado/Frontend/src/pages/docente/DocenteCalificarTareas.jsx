import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";

const DocenteCalificarTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const docenteId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    cargarMisTareas();
  }, []);

  const cargarMisTareas = async () => {
    try {
      const res = await axiosInstance.get(`/docentes/desempeno/${docenteId}`);
      setTareas(res.data);
    } catch (err) {
      console.error("Error al obtener tareas del docente:", err);
    }
  };

  const handleCalificar = async (tareaId, estado) => {
    try {
      await axiosInstance.put(`/tareas/calificar/${tareaId}`, { estado });
      setMensaje("Tarea calificada correctamente");
      await cargarMisTareas();
    } catch (err) {
      console.error("Error al calificar tarea:", err);
      setMensaje("Error al calificar tarea");
    }
  };

  const getArchivoURL = (archivoNombre) => {
    return `http://localhost:3000/entregas/${archivoNombre}`;
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Calificar Tareas</h1>

          {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha de inicio</th>
                <th>Fecha de entrega</th>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Archivo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td>{tarea.titulo}</td>
                  <td>{tarea.fecha_inicio}</td>
                  <td>{tarea.fecha_entrega}</td>
                  <td>{tarea.estudiante?.nombre}</td>
                  <td>{tarea.estado}</td>
                  <td>
                    {tarea.archivoEntrega ? (
                      <a
                        href={getArchivoURL(tarea.archivoEntrega)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          console.log("📂 Descargando archivo:", tarea.archivoEntrega)
                        }
                      >
                        Descargar
                      </a>
                    ) : (
                      "No entregado"
                    )}
                  </td>
                  <td>
                    {tarea.estado === "entregada" ? (
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        <Button onClick={() => handleCalificar(tarea.id, "correcta")}>
                          Correcta
                        </Button>
                        <Button onClick={() => handleCalificar(tarea.id, "tarde")}>Tarde</Button>
                        <Button onClick={() => handleCalificar(tarea.id, "con_errores")}>
                          Con Errores
                        </Button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default DocenteCalificarTareas;
