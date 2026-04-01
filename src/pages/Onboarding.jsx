import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, Sparkles, Building, MapPin, ShieldCheck, Flag } from 'lucide-react';
import './Onboarding.css';

const INDUSTRIES = ['Fintech', 'Healthcare', 'SaaS', 'AI / ML', 'E-commerce', 'Insurance', 'EdTech', 'Other'];
const SIZES = [
  { value: 'small', label: 'Small', desc: '1–50 employees' },
  { value: 'medium', label: 'Medium', desc: '51–500 employees' },
  { value: 'enterprise', label: 'Enterprise', desc: '500+ employees' },
];
const REGIONS = ['India', 'United States', 'European Union', 'UK', 'Singapore'];

const STEP_TITLES = ['Company Details', 'Operational Regions', 'Review & Launch'];

export default function Onboarding() {
  const navigate = useNavigate();
  const {
    company,
    regions,
    updateCompany,
    updateRegions,
    completeOnboarding,
  } = useAppContext();

  const [step, setStep] = useState(0);
  const [localCompany, setLocalCompany] = useState(company);
  const [localRegions, setLocalRegions] = useState(regions);

  const canNext = () => {
    if (step === 0) return localCompany.name && localCompany.industry && localCompany.size;
    if (step === 1) return localRegions.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step === 0) updateCompany(localCompany);
    if (step === 1) updateRegions(localRegions);
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    updateCompany(localCompany);
    updateRegions(localRegions);
    completeOnboarding();
    navigate('/map');
  };

  const toggleRegion = (r) => {
    setLocalRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  return (
    <div className="onboarding-container bg-background min-h-screen text-foreground relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gold rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[120px] opacity-5 pointer-events-none" />

      <Card className="w-full max-w-3xl glass-card relative z-10 border-border/50 bg-card/60 backdrop-blur-2xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-orange-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-orange-400">
              RegIntel
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground text-base">
            Global Regulatory Intelligence Onboarding
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-4 hide-scrollbar">
            {STEP_TITLES.map((title, i) => (
              <div key={i} className={`flex items-center gap-3 opacity-${i > step ? '40' : '100'} transition-opacity`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors
                  ${i === step ? 'bg-gold text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                  : i < step ? 'bg-emerald-600 text-white' 
                  : 'bg-muted border border-border text-muted-foreground'}`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium whitespace-nowrap hidden sm:block ${i === step ? 'text-gold' : i < step ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {title}
                </span>
                {i < 2 && <div className={`w-12 h-px ${i < step ? 'bg-emerald-600' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          <div className="min-h-[360px]">
            {/* Step 0: Company */}
            {step === 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">Tell us about your company</h2>
                  <p className="text-muted-foreground mt-2">Establish your baseline industry profile.</p>
                </div>

                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      placeholder="e.g. Acme Financial"
                      value={localCompany.name}
                      onChange={(e) => setLocalCompany({ ...localCompany, name: e.target.value })}
                      className="bg-background/50 border-white/10 focus-visible:ring-gold focus-visible:border-gold h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <select
                      className="flex h-12 w-full items-center justify-between rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      value={localCompany.industry}
                      onChange={(e) => setLocalCompany({ ...localCompany, industry: e.target.value })}
                    >
                      <option value="" disabled className="bg-card">Select industry</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind} className="bg-card text-foreground">{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label>Company Size</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {SIZES.map((s) => (
                        <div
                          key={s.value}
                          onClick={() => setLocalCompany({ ...localCompany, size: s.value })}
                          className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center gap-1 transition-all
                            ${localCompany.size === s.value 
                              ? 'border-gold bg-gold/10' 
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
                        >
                          <Building className={`w-5 h-5 ${localCompany.size === s.value ? 'text-gold' : 'text-muted-foreground'}`} />
                          <span className={`font-semibold text-sm ${localCompany.size === s.value ? 'text-gold' : 'text-foreground'}`}>{s.label}</span>
                          <span className="text-xs text-muted-foreground">{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Regions */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                 <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">Select Operational Regions</h2>
                  <p className="text-muted-foreground mt-2">These regions will be monitored on your global map.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {REGIONS.map((r) => (
                    <div
                      key={r}
                      onClick={() => toggleRegion(r)}
                      className={`cursor-pointer rounded-xl border p-5 flex flex-col items-center justify-center gap-3 transition-all relative
                        ${localRegions.includes(r) 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
                    >
                      {localRegions.includes(r) && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <MapPin className={`w-8 h-8 ${localRegions.includes(r) ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${localRegions.includes(r) ? 'text-white' : 'text-muted-foreground'}`}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Summary */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">Configuration Complete</h2>
                  <p className="text-muted-foreground mt-2">Your global compliance engine is ready to deploy.</p>
                </div>

                <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 border border-white/10 bg-background/50 rounded-xl p-6">
                    <h3 className="font-semibold text-gold flex items-center gap-2 mb-4">
                      <Building className="w-4 h-4" /> Profile
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium text-white">{localCompany.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-muted-foreground">Industry</span>
                        <span className="font-medium text-white">{localCompany.industry}</span>
                      </div>
                      <div className="flex justify-between border-white/5 pb-2">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-medium text-white capitalize">{localCompany.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 border border-white/10 bg-background/50 rounded-xl p-6">
                    <h3 className="font-semibold text-gold flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4" /> Tracking Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {localRegions.map((r) => (
                        <Badge key={r} variant="secondary" className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                          <Flag className="w-3 h-3 mr-1.5 opacity-70" /> {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-8 pt-4 pb-8 flex items-center justify-between border-t border-white/5">
          {step > 0 ? (
            <Button variant="outline" onClick={handleBack} className="bg-transparent border-white/10 text-white hover:bg-white/5">
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : <div />}
          
          {step < 2 ? (
            <Button 
              onClick={handleNext} 
              disabled={!canNext()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="bg-gradient-to-r from-gold to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            >
              Launch Global Engine <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
    </div>
  );
}
