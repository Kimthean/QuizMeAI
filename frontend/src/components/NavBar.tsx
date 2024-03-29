import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import SignInButton from "@/components/SignInButton";
import { UserAccNav } from "./UserAccNav";
import { ThemeToggle } from "./ThemeToggle";

const NavBar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] border-b border-zinc-300">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl py-3">
        <Link href={"/"} className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            QuizzMeAI
          </p>
        </Link>
        <div className="flex items-center">
          <ThemeToggle className="mr-4" />
          {session?.user ? (
            <UserAccNav user={session.user} />
          ) : (
            <SignInButton text={"Sign In"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
