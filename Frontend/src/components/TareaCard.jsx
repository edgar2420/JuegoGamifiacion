const TareaCard = ({ tarea }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "0.5rem" }}>
      <h4>{tarea.titulo}</h4>
      <p><strong>Estado:</strong> {tarea.estado}</p>
      <p><strong>Fecha de entrega:</strong> {new Date(tarea.fecha_entrega).toLocaleDateString()}</p>
    </div>
  );
};

export default TareaCard;
