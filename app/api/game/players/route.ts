import { gameManager } from "@/lib/game/GameManager";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as { id?: string; name?: string };

    if (!data?.id || !data?.name) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const result = gameManager.addPlayer({ id: data.id, name: data.name });

    if (!result.created) {
      return NextResponse.json(
        { message: "The player already exists", player: result.player },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "New Player has been created", player: result.player },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
