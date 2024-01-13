"use client";
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Timer } from "lucide-react";
import React, { useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { checkAnswerSchema } from "@/schemas/form/quizz";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { z } from "zod";
import { redirect } from "next/navigation";
import { apiBaseUrl } from "next-auth/client/_utils";
import { apiUrl } from "@/lib/apiUrl";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "options">[] };
};

function MCQSection(game: Props) {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const { toast } = useToast();
  const [now, setNow] = React.useState(new Date());

  const currentQuestion = React.useMemo(() => {
    return game.game.questions[questionIndex];
  }, [questionIndex, game.game.questions]);

  const { mutate: checkAnswer, status: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedOption],
      };
      try {
        const response = await axios.post(
          "http://127.0.0.1:5001/quizz-backend/us-central1/checkAnswer",
          payload,
          {
            baseURL: apiUrl,
          }
        );
        return response.data;
      } catch (error) {
        toast({
          title: "Vercel request timeout",
          description:
            "Vercel has timeout your request after chatgpt took more then 10s to generate your quiz.",
          variant: "destructive",
        });
      }
    },
  });

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: "Correct Answer",
            description: "You got it right!",
            variant: "success",
          });
          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: "Wrong Answer",
            description: "You got it wrong!",
            variant: "destructive",
          });
          setWrongAnswers((prev) => prev + 1);
        }
        if (questionIndex === game.game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, toast, game.game.questions.length, questionIndex]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hasEnded]);

  useEffect(() => {
    if (!game.game.questions.length) {
      toast({
        title: "Please try again",
        description: "There was an error whiles generating the quiz.",
        variant: "destructive",
      });

      setTimeout(() => {}, 5000);
      redirect("/quizz");
    }
  }, [game.game.questions.length, toast]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="mt-2 font-semibold text-white bg-green-500 px-4 rounded-md whitespace-nowrap">
          You&apos;ve completed the quiz! in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.game.timeStarted))}
        </div>
        <Link
          href={`/statistic/${game.game.id}`}
          className={cn(buttonVariants(), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] max-sm:pt-60 max-sm:px-6 pb-24">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p className="flex flex-col sm:flex-row">
            <span className="text-slate-400 mr-2 mb-2 sm:mb-0">Topic</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            <span>
              {formatTimeDelta(differenceInSeconds(now, game.game.timeStarted))}
            </span>
          </div>
        </div>
        <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        />
      </div>
      <Card className="mt-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y devide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center mt-4 w-full">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedOption === index ? "default" : "secondary"}
            className="justify-start w-[80vw] py-8 mb-4 rounded-md"
            onClick={() => {
              setSelectedOption(index);
            }}
          >
            <div className="flex items-center justify-start">
              <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
              <div className="text-start h-auto whitespace-normal">
                {option}
              </div>
            </div>
          </Button>
        ))}
        <Button
          className="mt-2"
          onClick={handleNext}
          disabled={isChecking === "pending"}
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default MCQSection;
