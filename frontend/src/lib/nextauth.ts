import {
  NextAuthOptions,
  type DefaultSession,
  getServerSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token }) => {
      const db_user = await prisma.user.findFirst({
        where: {
          email: token?.email,
        },
      });
      if (db_user) {
        token.id = db_user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },

  secret: process.env.NextAuthSecret,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.Google_Client_Id as string,
      clientSecret: process.env.Google_Client_Secret as string,
    }),
    GitHubProvider({
      clientId: process.env.Github_Client_Id as string,
      clientSecret: process.env.Github_Client_Secret as string,
    }),
  ],
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
