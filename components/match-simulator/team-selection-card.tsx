'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import teamsData from '@/lib/mocks/teams.json';

// We'll define a type for modifiers to keep it clean
export interface ModifiersState {
  redCard: boolean;
  keyAttackerInjured: boolean;
  keyDefenderInjured: boolean;
}

interface TeamSelectionCardProps {
  type: 'home' | 'away';
  selectedTeamId: string;
  opponentTeamId: string;
  modifiers: ModifiersState;
  onTeamChange: (teamId: string) => void;
  onModifierChange: (key: keyof ModifiersState, value: boolean) => void;
}

export function TeamSelectionCard({ type, selectedTeamId, opponentTeamId, modifiers, onTeamChange, onModifierChange }: TeamSelectionCardProps) {
  const isHome = type === 'home';

  // Find the selected team's full object to display the name
  const selectedTeam = teamsData.find((t) => t.id === selectedTeamId);

  return (
    <Card className={`relative overflow-hidden border-0 bg-card/50 shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 ${isHome ? 'ring-1 ring-blue-500/20' : 'ring-1 ring-emerald-500/20'}`}>
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 ${isHome ? 'bg-blue-500' : 'bg-emerald-500'}`} />

      <CardHeader className="pb-4 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight">
            <span className={`flex size-8 items-center justify-center rounded-lg ${isHome ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {isHome ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              )}
            </span>
            {isHome ? 'Home Team' : 'Away Team'}
          </CardTitle>
          <Badge variant="secondary" className={`text-[10px] font-semibold uppercase tracking-wider ${isHome ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isHome ? 'Home' : 'Away'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Select Team</Label>
          <Select value={selectedTeamId} onValueChange={onTeamChange}>
            <SelectTrigger className="h-12 border-border/50 bg-background/50 text-base font-medium transition-colors hover:bg-background focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select team">{selectedTeam ? selectedTeam.name : 'Select team'}</SelectValue>
            </SelectTrigger>
            <SelectContent className="border-border/50 bg-popover/95 backdrop-blur-xl">
              {teamsData.map((team) => (
                <SelectItem key={team.id} value={team.id} disabled={team.id === opponentTeamId} className="font-medium focus:bg-primary/10">
                  {team.name} <span className="text-muted-foreground text-xs ml-2">({team.league})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Match Conditions</Label>

          <div className="space-y-2">
            <ModifierSwitch
              id={`${type}-red-card`}
              label="Red Card (-20% Stats)"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                  <rect width="14" height="20" x="5" y="2" rx="2" />
                </svg>
              }
              checked={modifiers.redCard}
              onCheckedChange={(checked) => onModifierChange('redCard', checked)}
            />
            <ModifierSwitch
              id={`${type}-attacker-out`}
              label="Key Attacker Out"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              }
              checked={modifiers.keyAttackerInjured}
              onCheckedChange={(checked) => onModifierChange('keyAttackerInjured', checked)}
            />
            <ModifierSwitch
              id={`${type}-defender-out`}
              label="Key Defender Out"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
              }
              checked={modifiers.keyDefenderInjured}
              onCheckedChange={(checked) => onModifierChange('keyDefenderInjured', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ModifierSwitchProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function ModifierSwitch({ id, label, icon, checked, onCheckedChange }: ModifierSwitchProps) {
  return (
    <div className={`flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/30 p-3 transition-all duration-200 hover:bg-background/50 ${checked ? 'ring-1 ring-primary/30 bg-primary/5' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-md bg-muted/50">{icon}</span>
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium tracking-tight">
          {label}
        </Label>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-primary" />
    </div>
  );
}
