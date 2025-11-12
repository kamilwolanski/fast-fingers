import { Player } from "@/lib/game/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  activePlayers: Player[];
  showLiveProgress?: boolean;
};

export default function TableResults({
  activePlayers,
  showLiveProgress = true,
}: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[160px] text-left">Name</TableHead>
            <TableHead className="w-[100px] text-left">Accuracy</TableHead>
            {showLiveProgress && (
              <TableHead className="w-[160px] text-left">
                Live progress
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {activePlayers.map((player) => {
            return (
              <TableRow key={player.id}>
                <TableCell className="font-medium max-w-[160px]">
                  {player.name}
                </TableCell>

                <TableCell className="font-medium">
                  {typeof player.accuracy === "number"
                    ? `${player.accuracy}%`
                    : player.accuracy}
                </TableCell>

                {showLiveProgress && (
                  <TableCell className="max-w-[160px]">
                    <div className="max-w-[150px] text-sm text-muted-foreground">
                      {player.liveProgress}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
