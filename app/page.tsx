"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
// import TableResults from "@/components/TableResults";
import { GameState, Player } from "@/lib/game/types";
// import GameBoard from "@/components/GameBoard";
import { formatMsToMMSS } from "@/lib/utils";
import { addPlayerToServer } from "@/lib/api/gameClient";

export default function Home() {
  const hasPlayer = localStorage.getItem("player");
  const [gameState, setGameState] = useState<GameState>();
  const [rem, setRem] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(() => {
    return !hasPlayer;
  });

  useEffect(() => {
    const getGameState = async () => {
      try {
        const gameResponse = await fetch("/api/game");
        const gameStateData: GameState = await gameResponse.json();
        setGameState(gameStateData);
        if (gameStateData.nextRoundStartAt) {
          if (gameStateData.nextRoundStartAt) {
            setRem(Math.max(0, gameStateData.nextRoundStartAt - Date.now()));
          }
        }
      } catch (err) {
        console.warn(err);
      }
    };
    
    getGameState();
    const intervalId = setInterval(() => {
      getGameState();
    }, 800);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (hasPlayer) {
      const player: Player = JSON.parse(hasPlayer);
      const isPlayerInTheServer = Boolean(
        gameState?.activePlayers.find((p) => p.id === player.id)
      );
      if (!isPlayerInTheServer) {
        addPlayerToServer(player);
      }
    }
  }, [gameState, hasPlayer]);

  useEffect(() => {
    if (!gameState?.nextRoundStartAt) return;
    const tick = () =>
      setRem(Math.max(0, gameState.nextRoundStartAt! - Date.now()));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [gameState?.nextRoundStartAt]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userName = formData.get("name");
    const newPlayer = {
      id: uuidv4(),
      name: String(userName),
    };
    localStorage.setItem("player", JSON.stringify(newPlayer));
    addPlayerToServer(newPlayer);
    setDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {rem > 0 && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Round starting soon"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative">
              {gameState?.lastGameResults &&
                gameState.lastGameResults.length > 0 && (
                  <h3 className="text-lg font-semibold mb-3">
                    Previous round results
                  </h3>
                )}

              <div className="text-sm text-gray-700">
                {gameState?.lastGameResults &&
                  gameState.lastGameResults.length > 0 && (
                    <div className="mb-3">
                      <TableResults
                        activePlayers={gameState.lastGameResults}
                        showLiveProgress={false}
                      />
                    </div>
                  )}

                <p className="font-medium">
                  Next round starts in:{" "}
                  <span className="font-mono">{formatMsToMMSS(rem)}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {gameState?.roundActive ? (
          <GameBoard gameState={gameState} />
        ) : (
          <p className="text-4xl text-center w-full">LOADING....</p>
        )}
        <Dialog open={dialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="grid gap-4"
            >
              <DialogHeader>
                <DialogTitle>Enter your display name</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3">
                <Label htmlFor="name-1">Display name</Label>
                <Input
                  id="name-1"
                  name="name"
                  defaultValue="Pedro Duarte"
                  placeholder="e.g. TypingPro123"
                  aria-label="Player display name"
                />
              </div>

              <Button type="submit">Join game</Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
