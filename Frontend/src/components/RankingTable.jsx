const RankingTable = ({ ranking }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Posición</th>
          <th>Estudiante</th>
          <th>Total CC</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((item, index) => (
          <tr key={index} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
            <td>{item.posicion}</td>
            <td>{item.estudiante?.nombre || "-"}</td>
            <td>{item.totalCC}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RankingTable;
