import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const LogrosPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Mis Logros</h1>
          <p>Aquí puedes ver tus logros desbloqueados.</p>
          {/* Aquí iría la lista de logros */}
        </main>
      </div>
    </div>
  );
};

export default LogrosPage;
