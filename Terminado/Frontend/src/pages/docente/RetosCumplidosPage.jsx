import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";

const RetosCumplidosPage = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const res = await axiosInstance.get("/temporada/historial-retos"); // Debes tener este endpoint en tu backend
      setHistorial(res.data);
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
          <h1>Retos Cumplidos por Temporada</h1>

          {historial.map((temp) => (
            <div key={temp.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <h2>{temp.nombre} ({temp.fecha_inicio} - {temp.fecha_fin})</h2>
              <p>🏆 Más tareas perfectas: {temp.retoMasTareas?.nombreEstudiante || "No registrado"}</p>
              <p>🏆 Mejor promedio de entrega: {temp.retoMejorPromedio?.nombreEstudiante || "No registrado"}</p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default RetosCumplidosPage;
