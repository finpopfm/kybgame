export default function DayHeader({ day, title, progress, timer }) {
  return (
    <div className="day-header">
      <div className="day-header__day">DAY {day}</div>
      <div className="day-header__title">{title}</div>
      <div className="day-header__stats">
        <div className="day-header__stat">
          <span className="day-header__stat-icon">📋</span>
          <span className="day-header__progress">{progress}</span>
        </div>
        {timer && (
          <div className="day-header__stat">
            <span className="day-header__stat-icon">⏱</span>
            <span className={`day-header__timer ${timer.isWarning ? 'day-header__timer--warning' : ''}`}>
              {timer.formatted}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
