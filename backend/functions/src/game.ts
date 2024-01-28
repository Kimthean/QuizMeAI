import * as functions from "firebase-functions";
import * as cors from "cors";
import { Request, Response } from "express";
import { prisma } from "./db";
import axios from "axios";

const corsHandler = cors({ origin: true });

export const handler = functions.https.onRequest(
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      try {
        const { userId, topic, type, amount } = request.body;

        const { data } = await axios.post(`${process.env.API_URL}/questions`, {
          amount,
          topic,
          type,
        });

        const game = await prisma.game.create({
          data: {
            gameType: type,
            timeStarted: null,
            userId: userId,
            topic,
          },
        });

        await prisma.topic_count.upsert({
          where: {
            topic,
          },
          create: {
            topic,
            count: 1,
          },
          update: {
            count: {
              increment: 1,
            },
          },
        });

        if (type === "mcq") {
          type mcqQuestion = {
            question: string;
            answer: string;
            option1: string;
            option2: string;
            option3: string;
          };

          const manyData = data.questions.map((question: mcqQuestion) => {
            const options = [
              question.option1,
              question.option2,
              question.option3,
              question.answer,
            ].sort(() => Math.random() - 0.5);
            return {
              question: question.question,
              answer: question.answer,
              options: JSON.stringify(options),
              gameId: game.id,
              questionType: "mcq",
            };
          });

          await prisma.question.createMany({
            data: manyData,
          });
        } else if (type === "open_ended") {
          type openQuestion = {
            question: string;
            answer: string;
          };
          await prisma.question.createMany({
            data: data.questions.map((question: openQuestion) => {
              return {
                question: question.question,
                answer: question.answer,
                gameId: game.id,
                questionType: "open_ended",
              };
            }),
          });
        }

        await prisma.game.update({
          where: {
            id: game.id,
          },
          data: {
            timeStarted: new Date(),
          },
        });

        response.json({ gameId: game.id });
      } catch (error) {
        console.error(error);
        response.json({ error: "An unexpected error occurred." });
      }
    });
  }
);
