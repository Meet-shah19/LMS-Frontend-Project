
export default function StatCard({
  title,
  value,
  subtitle = "",
  icon: Icon,
}) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>

        {Icon && (
          <div className="stat-card-icon">
            <Icon size={21} />
          </div>
        )}
      </div>

      <h2>{value ?? 0}</h2>

      {subtitle && <p>{subtitle}</p>}
    </article>
  );
}
