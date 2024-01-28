import { getAuthSession } from "@/lib/nextauth";
import React from "react";
import { prisma } from "@/lib/db";
import MCQSection from "@/components/MCQSection";
import { redirect } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

type Props = {
  params: {
    gameId: string;
  };
};

const page = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session) {
    toast({
      title: "You need to be logged in to play",
      variant: "destructive",
    });
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
          options: true,
        },
      },
    },
  });


  return (
    <div className="max-sm:mt-10">
      <MCQSection game={game} />
    </div>
  );
};

export default page;
