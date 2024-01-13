import React from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

type Props = {
  user: Pick<User, "name" | "image">;
};

export const revalidate = 1;

function UserAvatar({ user }: Props) {
  return (
    <Avatar>
      {user.image ? (
        <div className="w-full h-full relative aspect-square">
          <Image
            src={user.image}
            alt="profileImage"
            fill
            referrerPolicy="no-referrer"
          ></Image>
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
