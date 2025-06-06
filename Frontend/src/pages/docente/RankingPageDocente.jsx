import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../api/axiosInstance";

const RankingPageDocente = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    try {
      const res = await axiosInstance.get("/ranking/actual");
      setRanking(res.data);
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
          <h1>Ranking de la clase</h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Estudiante</th>
                <th>Total CC</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, index) => (
                <tr key={item.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td>{index + 1}</td>
                  <td>{item.estudiante?.nombre}</td>
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

export default RankingPageDocente;
