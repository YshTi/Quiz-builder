import { Question } from "@prisma/client";

import { CreateQuestionInput } from "../schemas/quizSchema";

export function serializeQuestion(question: CreateQuestionInput) {
  return {
    type: question.type,
    text: question.text.trim(),
    options: JSON.stringify(question.options),
    correctAnswers: JSON.stringify(question.correctAnswers),
  };
}

export function parseQuestion(question: Question) {
  return {
    ...question,
    options: JSON.parse(question.options) as string[],
    correctAnswers: JSON.parse(question.correctAnswers) as string[],
  };
}
