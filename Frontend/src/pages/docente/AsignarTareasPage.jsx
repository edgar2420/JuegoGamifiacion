import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/Button";

const AsignarTareasPage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    fecha_entrega: "",
    estudianteId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const res = await axiosInstance.get("/estudiante/obtener"); // Asegúrate que tienes este endpoint
      setEstudiantes(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener estudiantes");
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
      const docenteId = JSON.parse(localStorage.getItem("user")).id; // Suponiendo que tienes user en localStorage
      await axiosInstance.post("/tarea/crear-docente", {
        ...formData,
        docenteId,
      });
      setFormData({ titulo: "", fecha_entrega: "", estudianteId: "" });
      setError("");
      alert("Tarea asignada correctamente");
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

          <form onSubmit={handleSubmit}>
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
              <label>Fecha entrega:</label>
              <input
                type="date"
                name="fecha_entrega"
                value={formData.fecha_entrega}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Estudiante:</label>
              <select
                name="estudianteId"
                value={formData.estudianteId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un estudiante</option>
                {estudiantes.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nombre}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Asignar Tarea</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </main>
      </div>
    </div>
  );
};

export default AsignarTareasPage;
