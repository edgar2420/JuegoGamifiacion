import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";

const EstudianteEntregarTarea = () => {
  const [tareas, setTareas] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const res = await axiosInstance.get(`/tareas/por-estudiante/${user.id}`);
      setTareas(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar tareas");
    }
  };

  const handleFileChange = (e, tareaId) => {
    setSelectedFiles({
      ...selectedFiles,
      [tareaId]: e.target.files[0],
    });
  };

  const handleSubmit = async (tareaId) => {
    if (!selectedFiles[tareaId]) {
      alert("Por favor selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", selectedFiles[tareaId]);

    try {
      await axiosInstance.post(`/tareas/entregar/${tareaId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Tarea entregada correctamente");
      cargarTareas();
    } catch (err) {
      console.error(err);
      setError("Error al entregar tarea");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Entregar Tareas</h1>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha de entrega</th>
                <th>Estado</th>
                <th>Archivo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr
                  key={tarea.id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td>{tarea.titulo}</td>
                  <td>{tarea.fecha_entrega}</td>
                  <td>{tarea.estado}</td>
                  <td>
                    {tarea.estado === "pendiente" ? (
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, tarea.id)}
                        accept=".pdf,.zip,.rar,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      />
                    ) : (
                      "Archivo entregado"
                    )}
                  </td>
                  <td>
                    {tarea.estado === "pendiente" ? (
                      <Button onClick={() => handleSubmit(tarea.id)}>
                        Entregar
                      </Button>
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

export default EstudianteEntregarTarea;
