import { useEffect, useState } from "react";
import { obtenerRanking } from "../../api/ranking";
import Loader from "../../components/Loader";
import RankingTable from "../../components/RankingTable";

const RankingPageAdmin = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRanking = async () => {
      try {
        const data = await obtenerRanking();
        setRanking(data);
      } catch (error) {
        console.error("Error al cargar ranking", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRanking();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Ranking Global de Estudiantes</h2>
      {loading ? (
        <Loader />
      ) : (
        <RankingTable ranking={ranking} />
      )}
    </div>
  );
};

export default RankingPageAdmin;
