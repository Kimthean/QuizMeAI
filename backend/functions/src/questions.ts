import * as functions from "firebase-functions";
import { strict_output } from "./gpt";

export const handler = functions.https.onRequest(
  async (request: any, response: any) => {
    const { amount, topic, type } = request.body;
    let questions: any;
    if (type === "open_ended") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard open-ended questions about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 10 words",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 10 words, store all answers and questions and options in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 10 words",
          option1: "option1 with max length of 10 words",
          option2: "option2 with max length of 10 words",
          option3: "option3 with max length of 10 words",
        }
      );
    }
    response.send({ questions: questions });
  }
);
