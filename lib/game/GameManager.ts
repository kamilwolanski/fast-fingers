import { getRandomElFromArr } from "@/lib/utils";
import { SENTENCES } from "@/data/sentences";
import {
  DURATION_MS,
  NEXT_ROUND_DURATON_MS,
  PLAYER_TIMEOUT_MS,
} from "@/lib/game/constants";
import { GameState, NewPlayer, Player, PlayerUpdateBody } from "@/lib/game/types";

class GameManager {
  private state: GameState;

  constructor() {
    this.state = {
      currentSentence: null,
      activePlayers: [],
      roundActive: false,
      roundStarted: false,
      roundStartedAt: null,
      roundEndAt: null,
      nextRoundStartAt: null,
      lastGameResults: [],
    };
  }

  getState() {
    return structuredClone(this.state);
  }

  roundIsReadyToStart() {
    return this.state.activePlayers.length > 0;
  }

  roundIsRunning() {
    return this.state.roundStarted;
  }

  roundIsActive() {
    return this.state.roundActive;
  }

  activeRound() {
    if (!this.state.currentSentence) {
      this.state.currentSentence =
        (getRandomElFromArr(SENTENCES) as string) ?? null;
    }
    this.state.roundActive = true;
    const now = Date.now();
    this.state.nextRoundStartAt = now + NEXT_ROUND_DURATON_MS;
  }

  tryPendindRound() {
    const now = Date.now();
    if (this.state.nextRoundStartAt) {
      if (this.state.nextRoundStartAt < now) {
        this.state.roundStarted = true;
        this.state.roundStartedAt = now;
        this.state.roundEndAt = now + DURATION_MS;
      }
    }
  }

  tryEndingRound() {
    const now = Date.now();
    if (this.state.roundEndAt) {
      if (
        this.state.roundEndAt < now ||
        this.state.activePlayers.every((p) => p.hasFinishedRound)
      ) {
        const resetedPlayersResults = this.state.activePlayers.map((p) => ({
          ...p,
          accuracy: 100,
          liveProgress: "",
        }));
        this.state.lastGameResults = structuredClone(this.state.activePlayers);
        this.state.activePlayers = resetedPlayersResults;
        this.state.roundActive = false;
        this.state.nextRoundStartAt = null;
        this.state.currentSentence = null;
        this.state.roundStarted = false;
        this.state.roundEndAt = null;
        this.state.roundStartedAt = null;
      }
    }
  }

  addPlayer(newPlayer: NewPlayer): { created: boolean; player: Player } {
    const playerInState = this.state.activePlayers.find(
      (p) => p.id === newPlayer.id
    );

    if (playerInState) {
      return { created: false, player: playerInState };
    }

    const player: Player = {
      ...newPlayer,
      lastSeen: new Date(),
      accuracy: 100,
      liveProgress: "",
      hasFinishedRound: false,
    };

    this.state.activePlayers.push(player);
    return { created: true, player };
  }

  updatePlayerResults(
    player: { id: string; liveProgress: string } & PlayerUpdateBody
  ) {
    this.removeStalePlayers();
    const idx = this.state.activePlayers.findIndex((p) => p.id === player.id);

    // player not found
    if (idx === -1) {
      return null;
    }

    const updatedPlayer: Player = {
      ...this.state.activePlayers[idx],
      accuracy: player.accuracy,
      liveProgress: player.liveProgress,
      lastSeen: new Date(),
      hasFinishedRound: player.hasFinishedRound,
    };

    this.state.activePlayers[idx] = updatedPlayer;

    return updatedPlayer;
  }

  private removeStalePlayers() {
    const now = Date.now();
    this.state.activePlayers = this.state.activePlayers.filter(
      (player) => player.lastSeen.getTime() > now - PLAYER_TIMEOUT_MS
    );
  }
}

export const gameManager = new GameManager();
