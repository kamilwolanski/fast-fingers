import { gameManager } from "@/lib/game/GameManager";
import { PlayerUpdateBody } from "@/lib/game/types";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing player ID" },
        { status: 400 }
      );
    }

    const body: PlayerUpdateBody = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Empty body" }, { status: 400 });
    }

    const player = gameManager.updatePlayerResults({ ...body, id });

    if (!player) {
      return NextResponse.json(
        { message: "Player not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "", player, state: gameManager.getState() },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
