import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const TemporadasPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Gestión de Temporadas</h1>
          <p>Aquí puedes crear, cerrar y consultar temporadas académicas.</p>
          {/* Aquí luego puedes poner los formularios y la tabla de temporadas */}
        </main>
      </div>
    </div>
  );
};

export default TemporadasPage;
