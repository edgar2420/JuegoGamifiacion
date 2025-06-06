import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const TareasPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Mis Tareas</h1>
          <p>Aquí puedes consultar las tareas que has entregado.</p>
          {/* Aquí puedes renderizar la lista de tareas con <TareaCard tarea={...} /> */}
        </main>
      </div>
    </div>
  );
};

export default TareasPage;
