import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";

const getIcon = (pos) => {
  switch (pos) {
    case 1:
      return <FaTrophy style={{ color: "gold" }} />;
    case 2:
      return <FaMedal style={{ color: "silver" }} />;
    case 3:
      return <FaAward style={{ color: "#cd7f32" }} />;
    default:
      return pos;
  }
};

const RankingTable = ({ ranking = [] }) => {
  if (ranking.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#777" }}>
        No hay datos de ranking disponibles.
      </div>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
      <thead style={{ backgroundColor: "#343a40", color: "#fff" }}>
        <tr>
          <th style={{ padding: "12px" }}>Posición</th>
          <th style={{ padding: "12px" }}>Estudiante</th>
          <th style={{ padding: "12px" }}>Total CC</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((item, index) => (
          <tr
            key={index}
            style={{
              textAlign: "center",
              backgroundColor: index === 0 ? "#fffbea" : "#fff",
              borderBottom: "1px solid #ddd",
              fontWeight: index === 0 ? "bold" : "normal"
            }}
          >
            <td style={{ padding: "10px" }}>{getIcon(index + 1)}</td>
            <td style={{ padding: "10px" }}>{item.estudiante?.nombre || "-"}</td>
            <td style={{ padding: "10px" }}>{item.totalCC} CC</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RankingTable;
