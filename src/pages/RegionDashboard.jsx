import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ComplianceScore from '../components/ComplianceScore';
import RiskAlerts from '../components/RiskAlerts';
import ComplianceTrend from '../components/ComplianceTrend';
import ActionPlan from '../components/ActionPlan';
import AIAssistant from '../components/AIAssistant';
import DocumentVault from '../components/DocumentVault';
import { Activity, ShieldCheck } from 'lucide-react';

export default function RegionDashboard() {
  const { region } = useParams();
  const decodedRegion = decodeURIComponent(region);
  const { company } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 ml-[72px] flex flex-col min-h-screen relative">
        <TopBar regionName={decodedRegion} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
              {decodedRegion} {activeTab === 'documents' ? 'Document Vault' : 'Operations Center'}
              {activeTab === 'documents' ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <Activity className="w-6 h-6 text-gold" />}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'documents' 
                ? `Artifact compliance repository and extraction engine for ${company.name || 'your company'}.`
                : `Real-time regulatory telemetry and intelligence for ${company.name || 'your company'}.`
              }
            </p>
          </div>
          
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-12 gap-6 pb-12">
              <div className="col-span-12 xl:col-span-5 animate-in slide-in-from-bottom-8 fade-in duration-700">
                <ComplianceScore regionName={decodedRegion} />
              </div>
              
              <div className="col-span-12 xl:col-span-7 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                <ComplianceTrend regionName={decodedRegion} />
              </div>

              <div className="col-span-12 xl:col-span-5 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150">
                <RiskAlerts regionName={decodedRegion} />
              </div>
              
              <div className="col-span-12 xl:col-span-7 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                <ActionPlan regionName={decodedRegion} />
              </div>
              
              <div className="col-span-12 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
                <AIAssistant regionName={decodedRegion} />
              </div>
            </div>
          ) : activeTab === 'documents' ? (
            <div className="pb-12">
              <DocumentVault regionName={decodedRegion} />
            </div>
          ) : (
            <div className="flex items-center justify-center p-20 text-muted-foreground border border-dashed border-white/10 rounded-xl bg-white/5">
              Module under construction.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
