
function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  tone = "blue",
}) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-icon">
        <Icon size={25} />
      </div>

      <div>
        <span className="stat-label">
          {label}
        </span>

        <strong className="stat-value">
          {value}
        </strong>

        <span className="stat-subtitle">
          {subtitle}
        </span>
      </div>
    </article>
  );
}

export default StatCard;
