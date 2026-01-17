export default function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <h1>{value}</h1>
      <p>{title}</p>
    </div>
  );
}
