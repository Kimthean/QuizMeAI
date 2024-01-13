import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";
import CreateQuizz from "@/components/CreateQuizz";

type Props = {};

export const metadata = {
  title: "Quizz | QuizzMeAi",
  description: "Quizz page",
};

const page = async ({}: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div>
      <CreateQuizz />
    </div>
  );
};

export default page;
