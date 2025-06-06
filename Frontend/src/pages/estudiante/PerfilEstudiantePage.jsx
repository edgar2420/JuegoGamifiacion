import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const PerfilEstudiantePage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Mi Perfil</h1>
          <p>Aquí puedes consultar la información de tu perfil de estudiante.</p>
          {/* Aquí puedes renderizar <PerfilEstudiante estudiante={...} /> */}
        </main>
      </div>
    </div>
  );
};

export default PerfilEstudiantePage;
