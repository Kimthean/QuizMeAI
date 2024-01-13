import * as functions from "firebase-functions";
import { handler as questionHandler } from "./questions";
import { handler as gameHandler } from "./game";
import { handler as checkAnswerHandler } from "./checkAnswer";
import { handler as endGameHandler } from "./endGame";

export const questions = functions.https.onRequest(questionHandler);
export const game = functions.https.onRequest(gameHandler);
export const checkAnswer = functions.https.onRequest(checkAnswerHandler);
export const endGame = functions.https.onRequest(endGameHandler);
