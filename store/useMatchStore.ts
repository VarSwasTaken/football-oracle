import { create } from 'zustand';

type ModifierType = 'RedCard' | 'KeyAttackerInjured' | 'KeyDefenderInjured';

interface MatchState {
  homeRedCard: boolean;
  homeKeyAttackerInjured: boolean;
  homeKeyDefenderInjured: boolean;

  awayRedCard: boolean;
  awayKeyAttackerInjured: boolean;
  awayKeyDefenderInjured: boolean;

  toggleModifier: (team: 'home' | 'away', modifier: ModifierType) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  homeRedCard: false,
  homeKeyAttackerInjured: false,
  homeKeyDefenderInjured: false,

  awayRedCard: false,
  awayKeyAttackerInjured: false,
  awayKeyDefenderInjured: false,

  // Dynamically resolves the state key (e.g., 'home' + 'RedCard' -> 'homeRedCard')
  // and toggles its boolean value to avoid writing 6 separate functions.
  toggleModifier: (team, modifier) =>
    set((state) => {
      const stateKey = `${team}${modifier}` as keyof Omit<MatchState, 'toggleModifier'>;
      return {
        [stateKey]: !state[stateKey],
      };
    }),
}));
