export type Player = {
  id: string;
  name: string;
  lastSeen: Date;
  accuracy: number | null;
  liveProgress: string;
  hasFinishedRound: boolean;
};

export type NewPlayer = Pick<Player, 'id' | 'name'>

export type PlayerUpdateBody = Omit<Player, 'id' | 'name' | 'lastSeen'>

export type GameState = {
  roundActive: boolean;
  currentSentence: string | null;
  activePlayers: Player[];
  roundStartedAt: number | null;
  roundEndAt: number | null;
  roundStarted: boolean;
  nextRoundStartAt: number | null;
  lastGameResults: Player[];
};
