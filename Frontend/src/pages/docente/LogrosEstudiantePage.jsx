import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";

const LogrosEstudiantePage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [logros, setLogros] = useState([]);
  const [estudianteId, setEstudianteId] = useState("");

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const res = await axiosInstance.get("/estudiante/obtener");
      setEstudiantes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarLogros = async () => {
    try {
      if (estudianteId) {
        const res = await axiosInstance.get(`/logro/estudiante/${estudianteId}`);
        setLogros(res.data);
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
          <h1>Logros de Estudiante</h1>

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
            <button onClick={cargarLogros}>Ver Logros</button>
          </div>

          <ul style={{ marginTop: "1rem" }}>
            {logros.map((logro) => (
              <li key={logro.id}>
                🏅 {logro.nombre} - {logro.tipo} ({logro.fecha_obtenido})
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default LogrosEstudiantePage;
