import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Search, Bell, LogOut, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TopBar({ regionName }) {
  const { company, logout } = useAppContext();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link to="/map" className="font-medium text-blue-400 hover:text-gold transition-colors">
          Global Map
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-semibold text-gold tracking-wide">{regionName}</span>
        <Badge variant="outline" className="ml-2 border-gold/30 text-gold bg-gold/5 uppercase tracking-wider text-[10px]">
          Active Region
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-gold hover:bg-gold/10">
          <Search className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-gold hover:bg-gold/10">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border/50 bg-card/40">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold to-orange-500 flex items-center justify-center text-black font-bold shadow-sm">
            {company.name ? company.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-sm font-semibold text-foreground leading-tight">{company.name || 'Admin'}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Security Lead</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout} 
            className="ml-2 h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
