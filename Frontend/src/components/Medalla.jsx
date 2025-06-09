const Medalla = ({ posicion }) => {
  if (posicion === 1) return <span>🥇</span>;
  if (posicion === 2) return <span>🥈</span>;
  if (posicion === 3) return <span>🥉</span>;
  return null;
};

export default Medalla;
