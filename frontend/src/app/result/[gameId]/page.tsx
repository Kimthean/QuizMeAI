import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ResultCard from "@/components/statistics/ResultCard";
import Score from "@/components/statistics/Score";
import TimeTaken from "@/components/statistics/TimeTaken";
import QuestionList from "@/components/statistics/QuestionList";
import Head from "@/components/statistics/Head";

type Props = {
  params: {
    gameId: string;
  };
};

const Statistics = async ({ params: { gameId } }: Props) => {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });
  if (!game) {
    return redirect("/");
  }
  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <Head game={game} />
        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultCard score={game.score} />
          <Score score={game.score} />
          <TimeTaken
            timeEnded={new Date(game.timeEnded ?? 0)}
            timeStarted={new Date(game.timeStarted ?? 0)}
          />
        </div>
        <QuestionList questions={game.questions} />
      </div>
    </>
  );
};

export default Statistics;
