export type Player = {
  id: string;
  name: string;
  lastSeen: Date;
  accuracy: number | null;
  liveProgress: string;
  hasFinishedRound: boolean;
};

export type NewPlayer = {
  id: string;
  name: string;
};

export type PlayerUpdateBody = {
  accuracy: number;
  liveProgress: string;
  hasFinishedRound: boolean;
};

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
