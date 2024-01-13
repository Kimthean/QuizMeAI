"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

type Props = {
  text: string;
};

function SignInButton({ text }: Props) {
  return (
    <div>
      <Button
        onClick={() => {
          signIn().catch(console.error);
        }}
      >
        {text}
      </Button>
    </div>
  );
}

export default SignInButton;
