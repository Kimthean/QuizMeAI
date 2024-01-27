import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard, LucideRefreshCcw } from "lucide-react";
import Link from "next/link";
import axios from "axios";

import { redirect } from "next/navigation";
import React from "react";
import ResultCard from "@/components/statistics/ResultCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTaken from "@/components/statistics/TimeTaken";
import QuestionList from "@/components/statistics/QuestionList";
import Head from "@/components/statistics/Head";

type Props = {
  params: {
    gameId: string;
  };
};

const Statistics = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });
  if (!game) {
    return redirect("/");
  }

  let accuracy: number = 0;

  if (game.gameType === "mcq") {
    let totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gameType === "open_ended") {
    let totalPercentage = game.questions.reduce((acc, question) => {
      if (question.percentageCorrect === null) {
        return acc;
      }
      return acc + Number(question.percentageCorrect);
    }, 0);
    accuracy = totalPercentage / game.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <Head game={game} />
        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
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
