'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ExactScore {
  homeGoals: number;
  awayGoals: number;
  probability: number;
}

interface OverUnderLine {
  line: number;
  under: number;
  over: number;
}

interface BettingInsightsProps {
  exactScores: ExactScore[];
  overUnder: OverUnderLine[];
}

export function BettingInsights({ exactScores, overUnder }: BettingInsightsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Exact Scores Card */}
      <Card className="border-0 bg-card/50 shadow-xl shadow-black/5 ">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              </span>
              Top Exact Scores
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
              Top 3
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {exactScores.map((item, index) => (
              <div key={`${item.homeGoals}-${item.awayGoals}`} className="group flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4 transition-all duration-200 hover:bg-background/50 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <span className={`flex size-8 items-center justify-center rounded-lg font-mono text-sm font-bold ${index === 0 ? 'bg-amber-500/10 text-amber-500' : index === 1 ? 'bg-slate-400/10 text-slate-400' : 'bg-orange-600/10 text-orange-600'}`}>#{index + 1}</span>
                  <span className="font-mono text-xl font-bold tabular-nums tracking-wider">
                    {item.homeGoals} - {item.awayGoals}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Prob</p>
                    <p className="font-mono text-base font-semibold tabular-nums text-foreground">{item.probability.toFixed(1)}%</p>
                  </div>
                  <div className="h-8 w-px bg-border/50" />
                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Odds</p>
                    <p className="font-mono text-base font-semibold tabular-nums text-primary">{(100 / item.probability).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Over/Under Card */}
      <Card className="border-0 bg-card/50 shadow-xl shadow-black/5 ">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 16 4 4 4-4" />
                  <path d="M7 20V4" />
                  <path d="m21 8-4-4-4 4" />
                  <path d="M17 4v16" />
                </svg>
              </span>
              Goals Over / Under
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
              O/U Lines
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-20 font-semibold text-xs uppercase tracking-wider">Line</TableHead>
                  <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Under</TableHead>
                  <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Over</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overUnder.map((line, index) => (
                  <TableRow key={line.line} className={`border-border/50 transition-colors hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background/30' : 'bg-transparent'}`}>
                    <TableCell className="py-3">
                      <span className="inline-flex items-center justify-center rounded-md bg-muted/50 px-2.5 py-1 font-mono text-sm font-bold tabular-nums">{line.line}</span>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted/50">
                          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${line.under}%` }} />
                        </div>
                        <span className="w-14 font-mono text-sm font-medium tabular-nums">{line.under}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted/50">
                          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${line.over}%` }} />
                        </div>
                        <span className="w-14 font-mono text-sm font-medium tabular-nums">{line.over}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
