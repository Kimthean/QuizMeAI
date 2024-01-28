import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";

type Props = { score: number | null };

const ResultCard = ({ score }: Props) => {
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-3/5">
        {score !== null ? (
          score >= 75 ? (
            <>
              <Trophy className="mr-4" color="gold" size={60} />
              <div className="flex flex-col text-2xl font-semibold text-yellow-400">
                <span className="">Impressive!</span>
                <span className="text-sm text-center text-black opacity-50">
                  {score}% Accuracy
                </span>
              </div>
            </>
          ) : score >= 50 ? (
            <>
              <Trophy className="mr-4" color="silver" size={60} />
              <div className="flex flex-col text-2xl font-semibold text-stone-400">
                <span className="">Great!</span>
                <span className="text-sm text-center text-black opacity-50">
                  {score}% Accuracy
                </span>
              </div>
            </>
          ) : score >= 25 ? (
            <>
              <Trophy className="mr-4" color="bronze" size={60} />
              <div className="flex flex-col text-2xl font-semibold text-stone-400">
                <span className="">Good job!</span>
                <span className="text-sm text-center text-black opacity-50">
                  {score}% Accuracy
                </span>
              </div>
            </>
          ) : (
            <>
              <Trophy className="mr-4" stroke="brown" size={50} />
              <div className="flex flex-col text-2xl font-semibold text-yellow-800">
                <span className="">Nice try!</span>
                <span className="text-sm text-center text-black opacity-50">
                  {"< 25% accuracy"}
                </span>
              </div>
            </>
          )
        ) : (
          <div>No accuracy data available.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
