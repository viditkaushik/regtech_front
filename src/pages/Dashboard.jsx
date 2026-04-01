import { useAppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ComplianceScore from '../components/ComplianceScore';
import WorldMap from '../components/WorldMap';
import RegionCompliance from '../components/RegionCompliance';
import RiskAlerts from '../components/RiskAlerts';
import ComplianceTrend from '../components/ComplianceTrend';
import ActionPlan from '../components/ActionPlan';
import AIAssistant from '../components/AIAssistant';
import './Dashboard.css';

export default function Dashboard() {
  const { company } = useAppContext();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Compliance Dashboard</h1>
            <p>Real-time regulatory intelligence for <strong>{company.name}</strong></p>
          </div>
          <div className="dashboard-grid">
            <div className="grid-item grid-score">
              <ComplianceScore />
            </div>
            <div className="grid-item grid-map">
              <WorldMap />
            </div>
            <div className="grid-item grid-region">
              <RegionCompliance />
            </div>
            <div className="grid-item grid-alerts">
              <RiskAlerts />
            </div>
            <div className="grid-item grid-trend">
              <ComplianceTrend />
            </div>
            <div className="grid-item grid-actions">
              <ActionPlan />
            </div>
            <div className="grid-item grid-ai">
              <AIAssistant />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
