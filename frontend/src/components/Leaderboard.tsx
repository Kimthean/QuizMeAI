import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookCheck } from "lucide-react";
import { prisma } from "@/lib/db";

const Leaderboard = async () => {
  const users = await prisma.user.findMany({
    include: {
      games: {
        orderBy: {
          timeStarted: "desc",
        },
        select: {
          topic: true,
        },
      },
    },
  });
  users.sort((a, b) => {
    if (a.rank === null) return 1;
    if (b.rank === null) return -1;
    return a.rank - b.rank;
  });

  return (
    <div>
      {users.map((user, index) => (
        <div className="flex items-center justify-between pb-6" key={user.id}>
          <Accordion type="single" collapsible className="w-full no-underline">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center">
                  <p className="text-base font-medium">Rank: {index + 1}</p>
                  <div className="ml-4 flex items-center space-x-5 space-y-1">
                    <div className="text-base font-medium leading-none">
                      {user.name}
                    </div>
                    <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                      <BookCheck className="w-4 h-4 mr-1" />
                      Average Score: {user.averageScore ?? 0}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>Total Game Played: {user.games.length}</div>
                <div>
                  Latest Game Topic: {user.games[0]?.topic ?? "No games played"}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
