import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, FileText, Settings, HelpCircle, ShieldAlert, FileUp } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
  { id: 'documents', label: 'Vault', icon: FileUp },
  { id: 'compliance', label: 'Controls', icon: ShieldCheck },
  { id: 'reports', label: 'Audit Log', icon: FileText },
  { id: 'settings', label: 'System', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const [localActive, setLocalActive] = useState('dashboard');
  const currentActive = activeTab || localActive;

  const handleChange = (id) => {
    if (onTabChange) onTabChange(id);
    else setLocalActive(id);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-card border-r border-border/50 flex flex-col items-center py-6 z-50 shadow-2xl">
      <Link to="/map" className="mb-8" title="Global Dashboard">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:scale-105 transition-transform flex-shrink-0">
           <ShieldAlert className="w-6 h-6 text-black" />
        </div>
      </Link>

      <nav className="flex flex-col gap-4 flex-1 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentActive === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleChange(item.id)}
              className={`relative w-full aspect-square flex items-center justify-center rounded-xl transition-all group shrink-0
                ${isActive 
                  ? 'bg-gold/15 text-gold border border-gold/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'}`}
              title={item.label}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1 h-8 bg-gold rounded-r-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="w-full px-2 mt-auto">
        <button 
          className="w-full aspect-square flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          title="Support Helpdesk"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
