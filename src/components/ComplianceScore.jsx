import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Activity } from 'lucide-react';

export default function ComplianceScore({ regionName }) {
  const { getRegionScore, getSingleRegionStatus } = useAppContext();

  const score = getRegionScore(regionName);
  const statusObj = getSingleRegionStatus(regionName);

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-gold';
    return 'text-red-500';
  };
  
  const getStrokeColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#fbbf24';
    return '#ef4444';
  };

  const badgeVariant = score >= 80 ? 'default' : score >= 50 ? 'secondary' : 'destructive';
  const badgeLabel = score >= 80 ? 'Compliant' : score >= 50 ? 'At Risk' : 'Non-Compliant';

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="h-full bg-card/60 backdrop-blur-xl border-border/50 flex flex-col justify-between shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-gold" />
            Regional Score
          </CardTitle>
          <Badge variant={badgeVariant} className={score >= 50 && score < 80 ? 'bg-gold/20 text-gold hover:bg-gold/30' : ''}>
            {badgeLabel}
          </Badge>
        </div>
        <CardDescription>Overall compliance health for {regionName}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-border/30"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold tracking-tighter ${getScoreColor()} drop-shadow-[0_0_12px_currentColor]`}>
              {score}
            </span>
            <span className="text-sm font-medium text-muted-foreground">%</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex-col gap-2">
        <div className="w-full flex justify-between text-xs text-muted-foreground mb-1">
          <span>Active Controls</span>
          <span>{statusObj?.fulfilled || 0} / {statusObj?.total || 0}</span>
        </div>
        <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000" 
            style={{ width: `${score}%`, backgroundColor: getStrokeColor() }} 
          />
        </div>
      </CardFooter>
    </Card>
  );
}
