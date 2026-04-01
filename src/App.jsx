import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Onboarding from './pages/Onboarding';
import GlobalMapView from './pages/GlobalMapView';
import RegionDashboard from './pages/RegionDashboard';

function App() {
  const { onboarded } = useAppContext();

  return (
    <Routes>
      <Route
        path="/"
        element={onboarded ? <Navigate to="/map" replace /> : <Onboarding />}
      />
      <Route
        path="/map"
        element={onboarded ? <GlobalMapView /> : <Navigate to="/" replace />}
      />
      <Route
        path="/dashboard/:region"
        element={onboarded ? <RegionDashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
