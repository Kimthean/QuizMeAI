import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Props = {};

export default function Activity({}: Props) {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have played a total of 34 quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll"></CardContent>
    </Card>
  );
}
