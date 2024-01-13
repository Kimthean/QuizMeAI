"use client";
import React from "react";
import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import UserAvatar from "./UserAvatar";

type Props = {
  user: Pick<User, "name" | "email" | "image">;
};

export const UserAccNav = ({ user }: Props) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar user={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white" align="end">
          <div className="flex items-center gap-2 p-2 justify-start">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium"> {user.name}</p>}
              {user.email && (
                <p className="w-[200px] text-sm truncate text-zinc-700">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">Meow</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              signOut().catch(console.error);
            }}
            className="text-red-600 cursor-pointer"
          >
            SignOut
            <LogOut className="w-4 h-4 ml-2" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
