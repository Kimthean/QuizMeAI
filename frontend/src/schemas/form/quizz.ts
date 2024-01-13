import { z } from "zod";

export const quizzSchema = z.object({
  topic: z
    .string()
    .min(4, {
      message: "Topic must be at least 4 characters long",
    })
    .max(50, {
      message: "Topic must be at most 50 characters long",
    }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(5),
});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});
