import { useAppContext } from '../context/AppContext';
import './RegionCompliance.css';

export default function RegionCompliance() {
  const { regionStatuses } = useAppContext();

  const getStatusClass = (status) => {
    if (status === 'Compliant') return 'status-compliant';
    if (status === 'At Risk') return 'status-risk';
    return 'status-noncompliant';
  };

  const getStatusIcon = (status) => {
    if (status === 'Compliant') return '✓';
    if (status === 'At Risk') return '⚠';
    return '✕';
  };

  return (
    <div className="region-card-panel neumorphic-card">
      <h3>Region Compliance</h3>

      <div className="region-list">
        {regionStatuses.map((rs) => (
          <div key={rs.region} className="region-item">
            <div className="region-item-header">
              <span className="region-name">{rs.region}</span>
              <span className={`region-status ${getStatusClass(rs.status)}`}>
                {getStatusIcon(rs.status)} {rs.status}
              </span>
            </div>

            <div className="region-progress-bar">
              <div
                className={`region-progress-fill ${getStatusClass(rs.status)}`}
                style={{ width: `${rs.percentage}%` }}
              />
            </div>

            <div className="region-meta">
              <span className="region-pct">{rs.fulfilled}/{rs.total} controls</span>
              {rs.missing.length > 0 && (
                <div className="region-missing">
                  {rs.missing.map((m, i) => (
                    <span key={i} className="missing-tag">⚡ {m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
