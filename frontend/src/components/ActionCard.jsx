export default function ActionCard({ title, desc, icon, onClick }) {
  return (
    <div className="action-card" onClick={onClick} role="button">
      <div className="icon">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}
