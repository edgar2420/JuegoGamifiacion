const TareaCard = ({ tarea }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "0.5rem",
      }}
    >
      <h4>{tarea.titulo}</h4>
      <p>
        <strong>Estado:</strong> {tarea.estado}
      </p>
      <p>
        <strong>Fecha de entrega:</strong>{" "}
        {new Date(tarea.fecha_entrega).toLocaleDateString()}
      </p>
      <p>
        <strong>Archivo:</strong>{" "}
        {tarea.archivo_entrega ? (
          <a
            href={`http://localhost:3000/entregas/${tarea.archivo_entrega}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver archivo
          </a>
        ) : (
          "No entregado"
        )}
      </p>
    </div>
  );
};

export default TareaCard;
