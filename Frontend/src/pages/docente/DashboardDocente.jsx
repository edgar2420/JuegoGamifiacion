import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const DashboardDocente = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Dashboard Docente</h1>
          <p>Bienvenido al panel del docente.</p>
          <p>Aquí puedes gestionar tus tareas, temporadas y ver el desempeño de los estudiantes.</p>
        </main>
      </div>
    </div>
  );
};

export default DashboardDocente;
