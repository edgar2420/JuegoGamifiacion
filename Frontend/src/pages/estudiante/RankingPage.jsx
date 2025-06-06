import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const RankingPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "1rem", overflowY: "auto" }}>
          <h1>Ranking Actual</h1>
          <p>Aquí puedes ver el ranking de tu clase.</p>
          {/* Aquí puedes renderizar <RankingTable ranking={...} /> */}
        </main>
      </div>
    </div>
  );
};

export default RankingPage;
