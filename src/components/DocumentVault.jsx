import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

const REQUIRED_DOCUMENTS = [
  { id: 1, name: 'Internal Policies / SOPs', desc: 'Shows what the company claims it does. Used to detect policy vs regulation gaps.', frequency: 'One-time bulk + version update' },
  { id: 2, name: 'Control Library', desc: 'Defines mechanisms enforcing compliance (checks, workflows, systems).', frequency: 'One-time + quarterly update' },
  { id: 3, name: 'System Inventory', desc: 'Maps where processes actually run (systems, regions, data types).', frequency: 'One-time + on system change' },
  { id: 4, name: 'Policy Process Mapping', desc: 'Connects policy intent to actual workflow steps. Enables coverage + design validation.', frequency: 'On process changes' },
  { id: 5, name: 'Control System Mapping', desc: 'Shows where controls are implemented. Core for detecting enforcement gaps.', frequency: 'On control/system updates' },
  { id: 6, name: 'Configuration Snapshots', desc: 'Captures actual system settings (e.g., time limits). Detects design violations.', frequency: 'Baseline + on change (or daily)' },
  { id: 7, name: 'Execution Metadata', desc: 'Shows what actually happens in reality (alerts, reviews, failures).', frequency: 'Daily / weekly (API or batch)' },
  { id: 8, name: 'Exception / Override Logs', desc: 'Captures where rules are bypassed. Most real violations occur here.', frequency: 'Real-time / weekly feed' },
];

export default function DocumentVault({ regionName }) {
  const [docs, setDocs] = useState(REQUIRED_DOCUMENTS.map(d => ({ ...d, uploadedAt: null, nextDue: null })));
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setDocs(prev => {
        const next = [...prev];
        const unuploadedIdx = next.findIndex(d => !d.uploadedAt);
        if (unuploadedIdx > -1) {
          const now = new Date();
          next[unuploadedIdx].uploadedAt = now.toISOString();
          
          const due = new Date();
          const freq = next[unuploadedIdx].frequency.toLowerCase();
          if (freq.includes('daily')) due.setDate(due.getDate() + 1);
          else if (freq.includes('weekly')) due.setDate(due.getDate() + 7);
          else if (freq.includes('quarterly')) due.setMonth(due.getMonth() + 3);
          else due.setFullYear(due.getFullYear() + 1);
          
          next[unuploadedIdx].nextDue = due.toISOString();
        }
        return next;
      });
    }, 1500);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '--';
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
            Automated Artifact Ingestion
          </CardTitle>
          <CardDescription className="text-base max-w-xl mx-auto">
            Drag and drop your compliance artifacts here. We automatically parse your uploads and fulfill the required regional compliance criteria for {regionName}.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div 
            onClick={handleUpload}
            className={`border-2 border-dashed ${isUploading ? 'border-gold bg-gold/5' : 'border-white/20 bg-background/50'} rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors relative overflow-hidden`}
          >
            {isUploading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent w-full h-full -skew-x-12 animate-[shimmer_2s_infinite]" />
            )}
            
            <FileText className={`w-12 h-12 mb-3 ${isUploading ? 'text-gold animate-bounce' : 'text-muted-foreground'}`} />
            <h3 className="font-semibold text-lg text-white mb-1">
              {isUploading ? 'Deep Parsing Artifacts...' : 'Click or Drag files to upload'}
            </h3>
            <p className="text-sm text-muted-foreground">Supported: PDF, JSON extracts, CSV, DOCX</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden overflow-x-auto">
        <CardHeader className="bg-background/40 border-b border-border/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold" />
            Required Document Vault
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-background/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-gold w-[280px]">Document Type</TableHead>
                <TableHead className="text-gold">Frequency</TableHead>
                <TableHead className="text-gold">Last Uploaded</TableHead>
                <TableHead className="text-gold">Next Upload Due</TableHead>
                <TableHead className="text-gold text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id} className="border-border/50 group hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="font-medium text-white">{doc.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-[260px]">{doc.desc}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{doc.frequency}</TableCell>
                  <TableCell className="text-sm">
                    {doc.uploadedAt ? (
                       <span className="text-white bg-white/5 px-2 py-1 rounded inline-flex items-center gap-1.5 border border-white/10">
                         <Clock className="w-3 h-3 text-emerald-400" /> {formatDate(doc.uploadedAt)}
                       </span>
                    ) : (
                       <span className="text-muted-foreground italic">Not Uploaded</span>
                    )}
                  </TableCell>
                   <TableCell className="text-sm">
                    {doc.nextDue ? (
                       <span className="text-white px-2 py-1 bg-white/5 rounded inline-flex items-center gap-1.5 border border-white/10">
                         {formatDate(doc.nextDue)}
                       </span>
                    ) : (
                       <span className="text-muted-foreground italic">Pending Baseline</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {doc.uploadedAt ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 gap-1.5 justify-center py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-400 border-red-500/30 bg-red-500/10 gap-1.5 justify-center py-1">
                        <AlertTriangle className="w-3 h-3" /> Required
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
