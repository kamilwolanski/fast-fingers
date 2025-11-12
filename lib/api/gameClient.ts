export const addPlayerToServer = async (player: {
  id: string;
  name: string;
}) => {
  await fetch("/api/game/players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });
};

export const updatePlayerResult = async ({
  playerId,
  accuracy,
  typedText,
  finished,
}: {
  playerId: string;
  accuracy: number;
  typedText: string;
  finished: boolean;
}) => {
  await fetch(`/api/game/players/${playerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accuracy,
      liveProgress: typedText,
      hasFinishedRound: finished,
    }),
  });
};
