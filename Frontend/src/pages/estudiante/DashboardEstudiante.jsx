import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const DashboardEstudiante = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Dashboard Estudiante</h1>
          <p>Bienvenido a tu panel de estudiante.</p>
          <p>Aquí puedes consultar tu perfil, tus tareas, ranking y logros.</p>
        </main>
      </div>
    </div>
  );
};

export default DashboardEstudiante;
