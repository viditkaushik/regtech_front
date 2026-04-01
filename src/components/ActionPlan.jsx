import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckSquare, Clock, ShieldCheck } from 'lucide-react';

export default function ActionPlan({ regionName }) {
  const { getRegionActions } = useAppContext();
  const actions = getRegionActions(regionName);

  const getPriorityBadge = (p) => {
    if (p === 'High') return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30">High</Badge>;
    if (p === 'Medium') return <Badge variant="outline" className="bg-gold/10 text-gold hover:bg-gold/20 border-gold/30">Medium</Badge>;
    return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30">Low</Badge>;
  };

  return (
    <Card className="h-full bg-card/60 backdrop-blur-xl border-border/50 flex flex-col shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-gold" />
            Remediation Plan
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Pending: {actions.length}
          </div>
        </div>
        <CardDescription>Actionable tasks to resolve {regionName} compliance gaps</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0 px-1">
        {actions.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-8 m-5 border border-dashed border-border/50 rounded-xl bg-background/30 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-3 opacity-80" />
            <h4 className="font-semibold text-foreground">All Systems Compliant</h4>
            <p className="text-sm text-muted-foreground mt-1">No remediation actions required at this time.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[45%] text-xs font-semibold uppercase tracking-wider text-muted-foreground">Task</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Owner</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deadline</TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id} className="border-border/20 hover:bg-white/5 cursor-default transition-colors">
                  <TableCell className="font-medium text-sm py-4">{action.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{action.owner}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{action.deadline}</TableCell>
                  <TableCell className="text-right">{getPriorityBadge(action.priority)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
