import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import OpenEnded from "@/components/OpenEnded";

type Props = {
  params: {
    gameId: string;
  };
};

const page = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session) {
    redirect("/");
  }
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true,
        },
      },
    },
  });

  return <OpenEnded game={game} />;
};

export default page;