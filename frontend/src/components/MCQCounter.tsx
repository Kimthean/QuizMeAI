import React from "react";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "./ui/separator";
type Props = {
  correctAnswers: number;
  wrongAnswers: number;
};

function MCQCounter({ correctAnswers, wrongAnswers }: Props) {
  return (
    <Card className="flex flex-row items-center justify-center p-2 max-h-14">
      <CheckCircle2 className="mr-2 mx-sm:mr-1 max-sm:size-6" color="green" size={30} />
      <span className="mx-2 text-2xl max-sm:text-xl text-green">
        {correctAnswers}
      </span>
      <Separator orientation="vertical" />
      <span className="mx-3 text-2xl max-sm:text-xl text-red">
        {wrongAnswers}
      </span>
      <XCircle color="red" className="max-sm:size-6" size={30} />
    </Card>
  );
}

export default MCQCounter;
