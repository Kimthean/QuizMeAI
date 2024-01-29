import * as functions from "firebase-functions";
import { Request, Response } from "express";
import { prisma } from "./db";
import * as cors from "cors";

const corsHandler = cors({ origin: true });

export const handler = functions.https.onRequest(
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      const users = await prisma.user.findMany();

      const userScores = [];
      for (const user of users) {
        const games = await prisma.game.findMany({
          where: { userId: user.id },
        });

        let totalScore = 0;
        if (games.length > 0) {
          games.forEach((game) => {
            totalScore += game.score ?? 0;
          });
          const averageScore = Math.round(totalScore / games.length);

          if (averageScore !== null && averageScore !== 0) {
            userScores.push({ userId: user.id, averageScore });
          }
        }
      }

      userScores.sort((a, b) => b.averageScore - a.averageScore);

      for (let i = 0; i < userScores.length; i++) {
        const rank = i + 1;
        const { userId, averageScore } = userScores[i];

        await prisma.user.update({
          where: { id: userId },
          data: { rank, averageScore },
        });
      }

      response.status(200).send("Updated all user ranks and average scores");
    });
  }
);
