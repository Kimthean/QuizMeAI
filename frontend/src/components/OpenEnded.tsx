"use client";
import { Game, Question } from "@prisma/client";
import React, { useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight, Timer } from "lucide-react";
import { checkAnswerSchema } from "@/schemas/form/quizz";
import { useToast } from "./ui/use-toast";
import AnswerInput from "./AnswerInput";
import { redirect } from "next/navigation";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = (game: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [blankAnswer, setBlankAnswer] = React.useState("");

  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const { toast } = useToast();
  const [now, setNow] = React.useState(new Date());

  const currentQuestion = React.useMemo(() => {
    return game.game.questions[questionIndex];
  }, [questionIndex, game.game.questions]);

  const { mutate: checkAnswer, status: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll("#user-blank-input").forEach((input) => {
        filledAnswer = filledAnswer.replace("_____", input.value);
        input.value = "";
      });
      const payload = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };
      console.log(payload);
      await checkAnswerSchema.parseAsync(payload);
      const response = await axios.post(
        "http://127.0.0.1:5001/quizz-backend/us-central1/checkAnswer",
        payload
      );
      return response.data;
    },
  });

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ similarity }) => {
        if (similarity === 0) {
          toast({
            title: "Your answer is incorrect",
            description:
              "The answer you provided does not match the correct answer",
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: `Your answer is ${similarity}% similar to the correct answer`,
            description:
              "The answer is checked based on the similarity of the answer you provided and the correct answer",
            variant: "success",
            duration: 4000,
          });
        }
        if (questionIndex === game.game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, toast, game.game.questions.length, questionIndex]);

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

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] max-sm:pt-40">
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
      </div>
      <Card className="mt-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y devide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400 *:">
              {game.game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <AnswerInput
          answer={currentQuestion?.answer}
          setBlankAnswer={setBlankAnswer}
        />
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
};

export default OpenEnded;
