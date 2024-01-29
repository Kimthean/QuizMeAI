import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { BookCheck } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  rank: number | null;
  averageScore: number | null;
  games: { topic: string }[];
}

interface LeaderboardProps {
  users: User[];
}

const LeaderboardContent: React.FC<LeaderboardProps> = ({ users }) => {
  return (
    <div>
      {users.map((user, index) => (
        <div
          className="flex items-center justify-between pb-6 w-11/12 mx-auto"
          key={user.id}
        >
          <Accordion type="single" collapsible className="w-full no-underline">
            <AccordionItem value="item-1">
              <AccordionTrigger className="">
                <div className="flex items-center">
                  <p className="text-base font-medium items-center">
                    Rank: {index + 1}
                  </p>
                  <div className="ml-4 pr-4 flex items-center space-x-5 space-y-1">
                    <div className="text-base font-medium leading-none">
                      {user.name}
                    </div>
                    <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w- max-sm:h-10 bg-slate-900">
                      <BookCheck className="w-5 h-5 max-sm:hidden mr-1" />
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

export default LeaderboardContent;
