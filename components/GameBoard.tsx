"use client";

import { useSentence } from "@/hooks/useSentence";
import { useEffect, useRef, useState } from "react";
import TableResults from "@/components/TableResults";
import { GameState } from "@/lib/game/types";
import { formatMsToMMSS } from "@/lib/utils";
import { updatePlayerResult } from "@/lib/api/gameClient";

const GameBoard = ({ gameState }: { gameState: GameState }) => {
  const {
    currentSentence,
    roundEndAt,
    roundActive,
    activePlayers,
    roundStarted,
  } = gameState;
  const {
    value,
    error,
    accuracy,
    finished,
    typedText,
    handleChange,
    renderSentence,
  } = useSentence(currentSentence as string);

  const [remainingMs, setRemainingMs] = useState<number | null>(() =>
    roundEndAt ? roundEndAt - Date.now() : null
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (roundEndAt) {
      const tickMs = 200;
      const id = setInterval(() => {
        const rem = roundEndAt - Date.now();
        setRemainingMs(rem);
      }, tickMs);
      return () => clearInterval(id);
    }
  }, [roundActive, roundEndAt]);

  useEffect(() => {
    if (roundStarted) {
      inputRef.current?.focus();
    }
  }, [roundStarted]);

  useEffect(() => {
    const playerRaw = localStorage.getItem("player");
    if (playerRaw) {
      const player: { id: string; name: string } = JSON.parse(playerRaw);
      if (!roundStarted || !roundActive) return;
      const intervalId = setInterval(() => {
        updatePlayerResult({
          playerId: player.id,
          accuracy,
          typedText,
          finished,
        });
      }, 400);
      return () => clearInterval(intervalId);
    }
  }, [accuracy, finished, roundActive, roundStarted, typedText]);

  return (
    <div className="w-full mx-auto">
      <div className="mb-2">
        {roundActive && remainingMs !== null && (
          <p className="text-center mx-auto text-4xl bold w-full">
            Time left: {formatMsToMMSS(remainingMs)}
          </p>
        )}
      </div>

      <div className="w-full">
        <p>{renderSentence()}</p>
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={handleChange}
          disabled={!gameState.roundStarted}
          aria-invalid={error}
          className={`mt-4 rounded border px-3 py-2 outline-none w-full ${
            error
              ? "bg-red-100 border-red-500 text-red-700"
              : "bg-white border-zinc-300 text-black"
          }`}
        />
      </div>

      <TableResults activePlayers={activePlayers} />
    </div>
  );
};

export default GameBoard;
