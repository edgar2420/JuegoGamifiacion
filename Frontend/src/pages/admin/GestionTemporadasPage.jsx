import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import TemporadasGestion from "../../components/TemporadasGestion";

const GestionTemporadasPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Gestión de Temporadas (Admin)</h1>
          <TemporadasGestion />
        </main>
      </div>
    </div>
  );
};

export default GestionTemporadasPage;
