import * as functions from "firebase-functions";
import { handler as questionHandler } from "./questions";
import { handler as gameHandler } from "./game";
import { handler as checkAnswerHandler } from "./checkAnswer";
import { handler as endGameHandler } from "./endGame";
import { handler as resetTimeStartedHandler } from "./resetTimeStarted";

export const questions = functions
  .region("asia-east2")
  .https.onRequest(questionHandler);
export const game = functions.region("asia-east2").https.onRequest(gameHandler);
export const checkAnswer = functions
  .region("asia-east2")
  .https.onRequest(checkAnswerHandler);
export const endGame = functions
  .region("asia-east2")
  .https.onRequest(endGameHandler);

export const resetTimeStarted = functions
  .region("asia-east2")
  .https.onRequest(resetTimeStartedHandler);
