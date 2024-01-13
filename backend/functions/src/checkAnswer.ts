import * as functions from "firebase-functions";
import { prisma } from "./db";
import { Request, Response } from "express";
import { compareTwoStrings } from "string-similarity";
import * as cors from "cors";

const corsHandler = cors({ origin: true });

export const handler = functions.https.onRequest(
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      try {
        const { questionId, userAnswer } = request.body;
        const question = await prisma.question.findUnique({
          where: {
            id: questionId,
          },
        });
        if (!question) {
          response.status(200).json({
            error: "Question not found",
          });
          return;
        }
        await prisma.question.update({
          where: {
            id: questionId,
          },
          data: {
            userAnswer,
          },
        });
        if (question.questionType == "mcq") {
          const isCorrect =
            question.answer.toLowerCase() == userAnswer.toLowerCase();
          await prisma.question.update({
            where: {
              id: questionId,
            },
            data: {
              isCorrect,
            },
          });
          response.status(200).json({
            isCorrect,
          });
          return;
        } else if (question.questionType == "open_ended") {
          const trimmedUserAnswer = userAnswer.toLowerCase().trim();
          const trimmedCorrectAnswer = question.answer.toLowerCase().trim();
          console.log({
            Correct: trimmedCorrectAnswer,
            User: trimmedUserAnswer,
          });
          let similarity;
          if (trimmedUserAnswer === trimmedCorrectAnswer) {
            similarity = 10;
          } else {
            similarity = compareTwoStrings(
              trimmedUserAnswer,
              trimmedCorrectAnswer
            );
            similarity = Math.round(similarity * 100);
            if (similarity < 80) {
              similarity = 0;
            }
          }

          await prisma.question.update({
            where: {
              id: questionId,
            },
            data: {
              percentageCorrect: similarity,
            },
          });
          response.status(200).json({
            similarity,
          });
          return;
        } else {
          response.status(400).json({ error: "Invalid question type" });
          return;
        }
      } catch (error) {
        if (error) {
          response.status(400).json({
            error: error,
          });
          return;
        }
      }
      response.status(500).end();
    });
  }
);
