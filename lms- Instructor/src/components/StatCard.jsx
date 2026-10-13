
export default function StatCard({ title, value, note, icon: Icon, color }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={21} />
      </div>
      <p>{title}</p>
      <h2>{value}</h2>
      <small>{note}</small>
    </article>
  );
}