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
        console.log(gameId);
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
