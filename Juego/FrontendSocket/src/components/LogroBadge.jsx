const LogroBadge = ({ nombre, descripcion }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "0.5rem",
        margin: "0.5rem",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <strong>{nombre}</strong>
      <p>{descripcion}</p>
    </div>
  );
};

export default LogroBadge;
