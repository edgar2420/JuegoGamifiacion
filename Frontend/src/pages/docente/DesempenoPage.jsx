import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";

const DesempenoPage = () => {
  const [desempeno, setDesempeno] = useState([]);

  useEffect(() => {
    cargarDesempeno();
  }, []);

  const cargarDesempeno = async () => {
    try {
      const res = await axiosInstance.get("/desempeno/obtener");
      setDesempeno(res.data);
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
          <h1>Desempeño de estudiantes</h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Total Tareas</th>
                <th>Tareas Correctas</th>
                <th>Porcentaje Correctas</th>
                <th>Total CC</th>
              </tr>
            </thead>
            <tbody>
              {desempeno.map((item) => (
                <tr key={item.estudianteId} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td>{item.estudiante?.nombre}</td>
                  <td>{item.totalTareas}</td>
                  <td>{item.tareasCorrectas}</td>
                  <td>
                    {item.totalTareas > 0
                      ? ((item.tareasCorrectas / item.totalTareas) * 100).toFixed(2)
                      : "0"}%
                  </td>
                  <td>{item.totalCC}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default DesempenoPage;
