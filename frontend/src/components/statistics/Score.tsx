import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
type Props = { score: number | null };

const Score = ({ score }: Props) => {
  if (score !== null) {
    score = Math.round(score * 100) / 100;
  }
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Score</CardTitle>
        <Target />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{score?.toString() + "%"}</div>
      </CardContent>
    </Card>
  );
};

export default Score;
