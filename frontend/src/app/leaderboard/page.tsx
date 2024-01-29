import React from "react";

import { redirect } from "next/navigation";
import Link from "next/link";
import { LucideLayoutDashboard, BookCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Leaderboard from "@/components/LeaderboardContent";
import { prisma } from "@/lib/db";
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
  console.log(users);
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
        <CardContent className="flex items-center justify-center">
          {/* <Avatar>
            {users.image ? (
              <div className="w-full h-full relative aspect-square">
                <Image
                  src={users.image}
                  alt="profileImage"
                  fill
                  referrerPolicy="no-referrer"
                ></Image>
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{users.name}</span>
              </AvatarFallback>
            )}
          </Avatar> */}
        </CardContent>
        <CardContent className="max-h-[60vh] overflow-scroll mx-auto">
          <Leaderboard users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
