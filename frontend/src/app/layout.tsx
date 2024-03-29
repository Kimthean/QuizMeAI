import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import { Provider } from "@/components/Provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizzMeAI",
  description: "Infinite Quiz Generation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </head>
      <body className={cn(inter.className, "antialiased min-h-screen pt-16")}>
        <Provider>
          <NavBar />
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
