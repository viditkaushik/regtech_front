import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function RiskAlerts({ regionName }) {
  const { getRegionAlerts } = useAppContext();
  const alerts = getRegionAlerts(regionName);

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High':
        return { icon: AlertTriangle, colorClass: 'text-red-500', bgClass: 'bg-red-500/10 border-red-500/20' };
      case 'Medium':
        return { icon: AlertCircle, colorClass: 'text-gold', bgClass: 'bg-gold/10 border-gold/20' };
      default:
        return { icon: Info, colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10 border-blue-500/20' };
    }
  };

  return (
    <Card className="h-full bg-card/60 backdrop-blur-xl border-border/50 flex flex-col shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            Risk Monitor
          </CardTitle>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
              {alerts.length} Warnings
            </Badge>
          )}
        </div>
        <CardDescription>Detected compliance gaps in {regionName}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/50 rounded-xl bg-background/30">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-3 opacity-80" />
            <h4 className="font-semibold text-foreground">Zero Risks Detected</h4>
            <p className="text-sm text-muted-foreground mt-1">This region is operating securely and within compliance bounds.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => {
              const { icon: Icon, colorClass, bgClass } = getPriorityConfig(alert.priority);
              return (
                <div key={alert.id} className={`flex items-start gap-3 p-4 rounded-lg border ${bgClass} transition-colors hover:brightness-110`}>
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colorClass}`} />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-tight text-foreground">{alert.message}</p>
                    <div className="flex items-center gap-2 opacity-80">
                      <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 border-current ${colorClass}`}>
                        {alert.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.regulation}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
