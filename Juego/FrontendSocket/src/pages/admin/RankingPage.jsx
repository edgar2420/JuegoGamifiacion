import { useEffect, useState } from "react";
import socket from "../../api/socket";
import { getRankingActual } from "../../api/ranking";
import RankingTable from "../../components/RankingTable";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);

  const fetchRanking = async () => {
    try {
      const res = await getRankingActual();
      setRanking(res.ranking);
    } catch (err) {
      console.error("Error al obtener ranking:", err);
    }
  };

  useEffect(() => {
    fetchRanking();

    socket.on("rankingActualizado", () => {
      console.log("📡 Ranking actualizado por socket (admin)");
      fetchRanking();
    });

    return () => socket.off("rankingActualizado");
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main className="p-4">
          <h2 className="mb-4">Ranking Global en Tiempo Real</h2>
          <RankingTable datos={ranking} />
        </main>
      </div>
    </div>
  );
};

export default RankingPage;
