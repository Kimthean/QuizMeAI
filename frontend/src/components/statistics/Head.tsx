"use client";
import React, { useState } from "react";
import {
  LucideRefreshCcw,
  LucideLayoutDashboard,
  BookText,
  RotateCw,
} from "lucide-react";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Game {
  id: string;
  gameType: string;
}

interface HeadProps {
  game: Game;
}

const Head: React.FC<HeadProps> = ({ game }) => {
  const router = useRouter();
  const [isRetryClicked, setRetryClicked] = useState(false);

  const handleRetry = async () => {
    setRetryClicked(true);
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resetTimeStarted`, {
      gameId: game.id,
    });

    router.push(`/play/${game.gameType}/${game.id}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
      <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <Link href="/dashboard" className={buttonVariants()}>
          <LucideLayoutDashboard className="mr-2" />
          Back to dashboard
        </Link>
        <Link href="/quizz" className={buttonVariants()}>
          <BookText className="mr-2" />
          Create New Quizz
        </Link>
        {isRetryClicked ? (
          <RotateCw className="mr-2 animate-spin w-6 h-6 items-center justify-center" />
        ) : (
          <button
            className={buttonVariants()}
            onClick={handleRetry}
            disabled={isRetryClicked}
          >
            <RotateCw className="w-6 h-6 mr-2" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default Head;
