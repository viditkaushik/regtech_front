import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateScore, getRegionStatus, generateActions, generateAlerts } from '../utils/complianceEngine';

const AppContext = createContext(null);

const defaultState = {
  company: {
    name: '',
    industry: '',
    size: '',
  },
  regions: [],
  policies: {
    encryptionAtRest: false,
    encryptionInTransit: false,
    loggingEnabled: false,
    kycUpdated: false,
    accessControl: false,
    auditLogs: false,
    dataDeletion: false,
  },
  additionalMeasures: '',
  onboarded: false,
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('regIntelState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    if (state.onboarded) {
      localStorage.setItem('regIntelState', JSON.stringify(state));
    } else {
      localStorage.removeItem('regIntelState');
    }
  }, [state]);

  const updateCompany = (company) => setState((prev) => ({ ...prev, company }));
  const updateRegions = (regions) => setState((prev) => ({ ...prev, regions }));
  const updatePolicies = (policies) => setState((prev) => ({ ...prev, policies }));
  const updateAdditionalMeasures = (additionalMeasures) =>
    setState((prev) => ({ ...prev, additionalMeasures }));
  const completeOnboarding = () => setState((prev) => ({ ...prev, onboarded: true }));
  const logout = () => {
    setState(defaultState);
  };

  // Memoized region specific getters to be used by components
  const getRegionScore = useCallback((regionName) => {
    if (!regionName) return calculateScore(state.policies); // Global average score if needed
    const { percentage } = getRegionStatus(regionName, state.policies);
    return percentage || 0;
  }, [state.policies]);

  const getRegionAlerts = useCallback((regionName) => {
    const allAlerts = generateAlerts(state.regions, state.policies);
    if (!regionName) return allAlerts;
    return allAlerts.filter(a => a.region === regionName);
  }, [state.regions, state.policies]);

  const getRegionActions = useCallback((regionName) => {
    const allActions = generateActions(state.regions, state.policies);
    if (!regionName) return allActions;
    return allActions.filter(a => a.regions.includes(regionName));
  }, [state.regions, state.policies]);
  
  const getSingleRegionStatus = useCallback((regionName) => {
    return getRegionStatus(regionName, state.policies);
  }, [state.policies]);

  // General computed values for global views
  const globalComplianceScore = calculateScore(state.policies);
  const regionStatuses = state.regions.map((region) => ({
    region,
    ...getRegionStatus(region, state.policies),
  }));

  return (
    <AppContext.Provider
      value={{
        ...state,
        globalComplianceScore,
        regionStatuses, // Used for map
        getRegionScore,
        getRegionAlerts,
        getRegionActions,
        getSingleRegionStatus,
        updateCompany,
        updateRegions,
        updatePolicies,
        updateAdditionalMeasures,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
