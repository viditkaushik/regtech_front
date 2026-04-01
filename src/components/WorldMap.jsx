import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useAppContext } from '../context/AppContext';
import './WorldMap.css';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map region names to country ISO codes
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

export default function WorldMap() {
  const { regions, regionStatuses } = useAppContext();
  const [tooltip, setTooltip] = useState(null);

  const selectedCountryIds = new Set();
  const regionByCountry = {};

  regions.forEach((region) => {
    const countries = REGION_COUNTRIES[region] || [];
    countries.forEach((id) => {
      selectedCountryIds.add(id);
      regionByCountry[id] = region;
    });
  });

  const getStatusColor = (countryId) => {
    const region = regionByCountry[countryId];
    if (!region) return '#e5e7eb';
    const rs = regionStatuses.find((r) => r.region === region);
    if (!rs) return '#e5e7eb';
    if (rs.status === 'Compliant') return '#34d399';
    if (rs.status === 'At Risk') return '#fbbf24';
    return '#f87171';
  };

  const handleGeoHover = (geo, evt) => {
    const countryId = geo.id;
    const region = regionByCountry[countryId];
    if (region) {
      const rs = regionStatuses.find((r) => r.region === region);
      setTooltip({
        name: region,
        status: rs?.status || 'Unknown',
        percentage: rs?.percentage ?? 0,
        x: evt.clientX,
        y: evt.clientY,
      });
    }
  };

  return (
    <div className="map-card neumorphic-card">
      <div className="map-header">
        <h3>Global Compliance Map</h3>
        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: '#34d399' }} /> Compliant</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#fbbf24' }} /> At Risk</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#f87171' }} /> Non-Compliant</span>
        </div>
      </div>

      <div className="map-container">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [20, 20],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isSelected = selectedCountryIds.has(geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isSelected ? getStatusColor(geo.id) : '#e5e7eb'}
                      stroke="#fff"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                          opacity: isSelected ? 1 : 0.6,
                        },
                        hover: {
                          outline: 'none',
                          opacity: 1,
                          fill: isSelected ? getStatusColor(geo.id) : '#d1d5db',
                          cursor: isSelected ? 'pointer' : 'default',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={(evt) => handleGeoHover(geo, evt)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {tooltip && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40, position: 'fixed' }}
        >
          <strong>{tooltip.name}</strong>
          <span className={`tooltip-status ${tooltip.status.toLowerCase().replace(' ', '-')}`}>
            {tooltip.status}
          </span>
          <span className="tooltip-pct">{tooltip.percentage}% compliant</span>
        </div>
      )}
    </div>
  );
}
