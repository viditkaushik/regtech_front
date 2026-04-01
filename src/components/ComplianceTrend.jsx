import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart as LineChartIcon } from 'lucide-react';

export default function ComplianceTrend({ regionName }) {
  const { getRegionScore } = useAppContext();
  const score = getRegionScore(regionName);

  const data = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const base = Math.max(20, score - 30);
    const step = (score - base) / 6;

    return days.map((day, i) => ({
      day,
      score: Math.round(base + step * i + (Math.random() * 8 - 4)),
    }));
  }, [score]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-muted-foreground mb-1 font-medium">{label}</p>
          <p className="text-sm font-bold text-gold">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full bg-card/60 backdrop-blur-xl border-border/50 shadow-xl flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-blue-400" />
              Trailing Performance
            </CardTitle>
            <CardDescription>7-day compliance trajectory for {regionName}</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{score}%</span>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Current</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 w-full mt-4 h-[220px] p-0 pr-6 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradientBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59,130,246,0.3)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#trendGradientBlue)"
              dot={{ r: 4, fill: '#0a0f1d', strokeWidth: 2, stroke: '#3b82f6' }}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0a0f1d', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
