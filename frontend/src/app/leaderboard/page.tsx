import React from "react";
import Link from "next/link";
import { LucideLayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Leaderboard from "@/components/LeaderboardContent";
import { prisma } from "@/lib/db";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const page = async () => {
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
  const champions = users.slice(0, 3);

  return (
    <div className="inset-0 flex items-center justify-center pt-10 mx-auto">
      <Card className="w-11/12 max-w-[500px] shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mx-auto">
            Leaderboard
          </CardTitle>
          <div className="mx-auto">
            <Link className={buttonVariants()} href="/dashboard">
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center space-x-5">
          {[champions[1], champions[0], champions[2]].map((champion, index) => (
            <div key={index} className="text-center">
              <Avatar
                className={`mx-auto ${
                  index === 1
                    ? "w-24 h-24"
                    : index === 0
                    ? "w-16 h-16"
                    : "w-16 h-16"
                }`}
              >
                {champion.image ? (
                  <div className="aspect-w-1 aspect-h-1">
                    <Image
                      src={champion.image}
                      alt="profileImage"
                      fill
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <AvatarFallback>
                    <span className="sr-only">{champion.name}</span>
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={`${
                  index === 1 ? "text-lg" : "text-base"
                } font-medium mt-2`}
              >
                {champion.name}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Average Score: {champion.averageScore}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Rank: {champion.rank}
              </div>
            </div>
          ))}
        </CardContent>
        <CardContent className="max-h-[60vh] overflow-scroll mx-auto">
          <Leaderboard users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
