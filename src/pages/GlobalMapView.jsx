import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import './GlobalMapView.css';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const REGION_COUNTRIES = {
  India: ['356'],
  'United States': ['840'],
  'European Union': [
    '040', '056', '100', '191', '196', '203', '208', '233', '246', '250',
    '276', '300', '348', '372', '380', '428', '440', '442', '470', '528',
    '616', '620', '642', '703', '705', '724', '752',
  ],
  UK: ['826'],
  Singapore: ['702'],
};

export default function GlobalMapView() {
  const navigate = useNavigate();
  const { company, regions, regionStatuses, logout } = useAppContext();
  const [hoverRegion, setHoverRegion] = useState(null);

  const selectedCountryIds = new Set();
  const regionByCountry = {};

  regions.forEach((region) => {
    const countries = REGION_COUNTRIES[region] || [];
    countries.forEach((id) => {
      selectedCountryIds.add(id);
      regionByCountry[id] = region;
    });
  });

  const handleRegionClick = (regionName) => {
    navigate(`/dashboard/${encodeURIComponent(regionName)}`);
  };

  const getStatusColor = (countryId, isHovered) => {
    const region = regionByCountry[countryId];
    if (!region) return 'rgba(255,255,255,0.05)'; // Unselected landmass
    
    // Always show gold accent when hovered or for active region hover
    if (isHovered || hoverRegion === region) return 'var(--accent-gold)';

    // Otherwise, show compliance level
    const rs = regionStatuses.find((r) => r.region === region);
    if (!rs) return 'rgba(59, 130, 246, 0.4)'; // fallback blue
    
    if (rs.status === 'Compliant') return 'rgba(16, 185, 129, 0.8)'; // green
    if (rs.status === 'At Risk') return 'rgba(245, 158, 11, 0.8)'; // warning
    return 'rgba(239, 68, 68, 0.8)'; // error
  };

  return (
    <div className="global-map-container">
      {/* Top Navigation Overlay */}
      <div className="global-map-nav">
        <div className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="url(#logo-grad2)" />
            <path d="M10 18L16 12L26 22L20 28L10 18Z" fill="white" opacity="0.9" />
            <defs>
              <linearGradient id="logo-grad2" x1="0" y1="0" x2="36" y2="36">
                <stop stopColor="var(--accent-gold)" />
                <stop offset="1" stopColor="var(--accent-orange)" />
              </linearGradient>
            </defs>
          </svg>
          <span>RegIntel <span className="logo-dim">Global</span></span>
        </div>
        
        <div className="nav-profile">
          <span className="nav-company">{company.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="map-intro">
        <h1 className="animate-fadeInUp">Select a Region</h1>
        <p className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          Click on any active region to view its specific regulatory intelligence dashboard.
        </p>
      </div>

      {/* Main Interactive Map */}
      <div className="global-map-wrapper animate-fadeInUp" style={{animationDelay: '0.2s'}}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
            center: [10, 20],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const region = regionByCountry[geo.id];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStatusColor(geo.id, false)}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none', transition: 'all 0.3s' },
                        hover: {
                          outline: 'none',
                          fill: region ? getStatusColor(geo.id, true) : 'rgba(255,255,255,0.1)',
                          cursor: region ? 'pointer' : 'default',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => region && setHoverRegion(region)}
                      onMouseLeave={() => setHoverRegion(null)}
                      onClick={() => region && handleRegionClick(region)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      
      {/* Legend */}
      <div className="global-map-legend glass-card">
        <span className="legend-title">Compliance Status Map</span>
        <div className="legend-items">
          <span className="l-item"><span className="l-dot" style={{background: 'rgba(16, 185, 129, 0.8)'}}></span> Compliant</span>
          <span className="l-item"><span className="l-dot" style={{background: 'rgba(245, 158, 11, 0.8)'}}></span> At Risk</span>
          <span className="l-item"><span className="l-dot" style={{background: 'rgba(239, 68, 68, 0.8)'}}></span> Non-Compliant</span>
        </div>
      </div>
    </div>
  );
}
