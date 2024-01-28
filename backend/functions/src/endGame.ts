import * as functions from "firebase-functions";
import { Request, Response } from "express";
import * as cors from "cors";
import { prisma } from "./db";

const corsHandler = cors({ origin: true });

export const handler = functions.https.onRequest(
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      try {
        const { gameId } = request.body;

        const game = await prisma.game.findUnique({
          where: {
            id: gameId,
          },
        });
        if (!game) {
          return response.status(404).json({
            message: "Game not found",
          });
        }
        await prisma.game.update({
          where: {
            id: gameId,
          },
          data: {
            timeEnded: new Date(),
          },
        });
        const questions = await prisma.question.findMany({
          where: {
            gameId: gameId,
          },
        });
        let score;
        if (game.gameType === "mcq") {
          let totalCorrect = questions.reduce((acc, question) => {
            if (question.isCorrect) {
              return acc + 1;
            }
            return acc;
          }, 0);
          score = (totalCorrect / questions.length) * 100;
        } else if (game.gameType === "open_ended") {
          let totalPercentage = questions.reduce((acc, question) => {
            if (question.percentageCorrect === null) {
              return acc;
            }
            return acc + Number(question.percentageCorrect);
          }, 0);
          score = totalPercentage / questions.length;
        }
        await prisma.game.update({
          where: {
            id: gameId,
          },
          data: {
            score: score,
          },
        });
        return response.json({
          message: "Game ended",
        });
      } catch (error) {
        return response.status(500).json({
          message: "Something went wrong",
        });
      }
    });
  }
);
