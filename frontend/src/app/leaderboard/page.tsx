import React from "react";

import { redirect } from "next/navigation";
import Link from "next/link";
import { LucideLayoutDashboard, BookCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Leaderboard from "@/components/Leaderboard";

const page = async () => {

  return (
    <div className="inset-0 flex items-center justify-center py-20 mx-auto">
      <Card className="w-10/12 lg:max-w-[500px] shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mx-auto">
            Leaderboard
          </CardTitle>
          <div className="mx-auto">
            <Link className={buttonVariants()} href="/dashboard">
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-scroll">
          <Leaderboard  />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
