import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const DashboardAdmin = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Panel de Administración</h1>
          <p>Bienvenido al panel de administrador.</p>
          <p>Aquí podrás gestionar usuarios, logros, temporadas, ranking global, etc.</p>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
