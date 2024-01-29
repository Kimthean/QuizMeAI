import { prisma } from "@/lib/db";
import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  limit: number;
  userId: string;
  orderBy: { score?: "desc"; timeEnded?: "desc" };
};

const PersonalBoard = async ({ limit, userId, orderBy }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    include: { questions: true },
    orderBy: orderBy,
  });

  return (
    <div className="space-y-8">
      {games.map((game) => {
        if (game.questions.length === 0) {
          return null;
        }

        return (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === "mcq" ? (
                <CopyCheck className="mr-3" />
              ) : (
                <Edit2 className="mr-3" />
              )}
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none underline"
                  href={`/result/${game.id}`}
                >
                  {game.topic}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {game.timeEnded
                    ? new Date(game.timeEnded).toLocaleDateString()
                    : "N/A"}
                  {game.score ? ` | Score: ${game.score}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PersonalBoard;
