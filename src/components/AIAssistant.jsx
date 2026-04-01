import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Terminal, Send, Bot, User } from 'lucide-react';

const SUGGESTIONS = [
  'What regulations affect me here?',
  'What should I fix first?',
  'Show my compliance gaps',
  'Summarize regional status',
];

export default function AIAssistant({ regionName }) {
  const { company, getRegionScore, getRegionAlerts, getRegionActions } = useAppContext();
  
  const score = getRegionScore(regionName);
  const alerts = getRegionAlerts(regionName);
  const actions = getRegionActions(regionName);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Initialization complete. RegIntel Agent bound to region: ${regionName}.\nStanding by for compliance queries from ${company.name}.`,
    },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        text: `Initialization complete. RegIntel Agent bound to region: ${regionName}.\nStanding by for compliance queries from ${company.name}.`,
      },
    ]);
  }, [regionName, company.name]);

  const generateResponse = (question) => {
    const q = question.toLowerCase();

    if (q.includes('regulation') || q.includes('affect')) {
      const map = {
        India: 'RBI Guidelines, IT Act 2000, DPDP Act 2023',
        'United States': 'SOX, CCPA, GLBA, HIPAA',
        'European Union': 'GDPR, PSD2, eIDAS, DORA',
        UK: 'UK GDPR, FCA Regulations',
        Singapore: 'PDPA, MAS TRM, Cybersecurity Act',
      };
      return `For ${regionName}, mapped frameworks include:\n\n• ${map[regionName] || 'General regional regulations'}`;
    }

    if (q.includes('fix') || q.includes('first') || q.includes('priority')) {
      if (actions.length === 0) return `All compliance actions resolved for ${regionName}.`;
      const top = actions.slice(0, 3).map((a) => `• ${a.title} (${a.priority} priority, Owner: ${a.owner})`).join('\n');
      return `Priority remediation tasks for ${regionName}:\n\n${top}`;
    }

    if (q.includes('gap') || q.includes('missing')) {
      if (alerts.length === 0) return `No gaps detected. Current baseline score: ${score}%.`;
      const gaps = alerts.slice(0, 4).map((a) => `• ${a.message}`).join('\n');
      return `Identified compliance alerts (${regionName}):\n\n${gaps}`;
    }
    
    if (q.includes('summarize') || q.includes('status')) {
       return `${regionName} Overview Baseline:\nScore: ${score}%\nActive Alerts: ${alerts.length}\nPending Tasks: ${actions.length}\n\n${score >= 80 ? 'Posture: Robust.' : 'Posture: Critical attention required.'}`;
    }

    return `Current score: ${score}%. Alerts: ${alerts.length}. Tasks: ${actions.length}. Awaiting specific query.`;
  };

  const handleSend = (text) => {
    const question = text || input;
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: generateResponse(question) },
      ]);
    }, 600);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl flex flex-col h-[400px]">
      <CardHeader className="pb-3 border-b border-white/5 bg-background/20 rounded-t-xl shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-gold/30 rounded-lg bg-gold/10 flex items-center justify-center text-gold shadow-[0_0_12px_rgba(251,191,36,0.2)]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground tracking-wide font-mono">RegIntel Engine</CardTitle>
              <CardDescription className="text-xs flex items-center gap-1.5 mt-0.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Live Connection: {regionName}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background/30 font-mono text-sm custom-scrollbar" ref={listRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="shrink-0 mt-0.5">
                {msg.role === 'assistant' ? (
                  <Bot className="w-5 h-5 text-gold" />
                ) : (
                  <User className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className={`px-4 py-2.5 rounded-lg whitespace-pre-line leading-relaxed border
                ${msg.role === 'assistant' 
                  ? 'bg-card/80 border-white/10 text-muted-foreground shadow-sm rounded-tl-sm' 
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-100 shadow-sm rounded-tr-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-4 flex-col gap-3 border-t border-white/5 shrink-0 bg-background/40 rounded-b-xl">
        <div className="flex gap-2 w-full overflow-x-auto pb-1 hide-scrollbar">
          {SUGGESTIONS.map((s) => (
            <Badge 
              key={s} 
              variant="outline" 
              className="cursor-pointer shrink-0 border-white/10 hover:border-gold/50 hover:bg-gold/10 hover:text-gold transition-colors font-mono text-xs py-1 px-3"
              onClick={() => handleSend(s)}
            >
              &gt; {s}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 w-full items-center">
          <Input
            className="flex-1 bg-background/50 border-white/10 focus-visible:ring-gold focus-visible:border-gold font-mono text-xs"
            placeholder="Type your query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="shrink-0 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-colors"
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
