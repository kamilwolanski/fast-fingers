import { gameManager } from "@/lib/game/GameManager";
import { NextResponse } from "next/server";

export async function GET() {
  if (gameManager.roundIsActive()) {
    if (!gameManager.roundIsRunning()) {
      gameManager.tryPendindRound(); 
    } else {
      gameManager.tryEndingRound();
    }
  } else if (gameManager.roundIsReadyToStart()) {
    gameManager.activeRound();
  }

  return NextResponse.json(gameManager.getState());
}
