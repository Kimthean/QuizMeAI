"use client";
import React from "react";
import { LucideRefreshCcw, LucideLayoutDashboard } from "lucide-react";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Game {
  id: string;
  gameType: string;
}

interface HeadProps {
  game: Game;
}

const Head: React.FC<HeadProps> = ({ game }) => {
  const router = useRouter();
  const handleRetry = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resetTimeStarted`, {
      gameId: game.id,
    });

    router.push(`/play/${game.gameType}/${game.id}`);
  };
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
      <div className="flex items-center space-x-2 sm:flex-auto">
        <Link href="/dashboard" className={buttonVariants()}>
          <LucideLayoutDashboard className="mr-2" />
          Back to Dashboard
        </Link>
        <button className={buttonVariants()} onClick={handleRetry}>
          <LucideRefreshCcw className="mr-2" />
          Retry
        </button>
      </div>
    </div>
  );
};

export default Head;
