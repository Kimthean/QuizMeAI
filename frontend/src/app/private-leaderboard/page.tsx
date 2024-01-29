import PersonalBoard from "@/components/PersonalBoard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";

const page = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div className="inset-0 flex items-center justify-center py-10">
      <Card className="w-10/12 lg:max-w-[500px] bg-white shadow-xl">
        <CardHeader className="flex justify-between items-center p-6">
          <CardTitle className="text-2xl font-bold">
            Personal Leaderboard
          </CardTitle>
          <Link
            className={`${buttonVariants()} text-white rounded px-4 py-2`}
            href="/dashboard"
          >
            <LucideLayoutDashboard className="mr-2" />
            Back to Dashboard
          </Link>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-scroll mx-auto p-6">
          <PersonalBoard
            limit={100}
            orderBy={{ score: "desc" }}
            userId={session.user.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
