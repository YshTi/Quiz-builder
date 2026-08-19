"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
  // Clear any existing database entries
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  // Seed sample Quiz 1: JavaScript Essentials
  const quiz1 = await prisma.quiz.create({
    data: {
      title: "JavaScript Essentials",
      questions: {
        create: [
          {
            type: "BOOLEAN",
            text: "JavaScript is a statically-typed language.",
            options: JSON.stringify(["True", "False"]),
            correctAnswers: JSON.stringify(["False"]),
          },
          {
            type: "INPUT",
            text: "What keyword is used to declare a block-scoped local variable that cannot be reassigned?",
            options: JSON.stringify([]),
            correctAnswers: JSON.stringify(["const"]),
          },
          {
            type: "CHECKBOX",
            text: "Which of the following are primitive data types in JavaScript?",
            options: JSON.stringify(["String", "Number", "Array", "Undefined"]),
            correctAnswers: JSON.stringify(["String", "Number", "Undefined"]),
          },
        ],
      },
    },
  });
  // Seed sample Quiz 2: HTML & Web Standards
  const quiz2 = await prisma.quiz.create({
    data: {
      title: "HTML & Web Standards",
      questions: {
        create: [
          {
            type: "BOOLEAN",
            text: "In HTML, block-level elements start on a new line and take up the full width available.",
            options: JSON.stringify(["True", "False"]),
            correctAnswers: JSON.stringify(["True"]),
          },
          {
            type: "INPUT",
            text: "What does CSS stand for?",
            options: JSON.stringify([]),
            correctAnswers: JSON.stringify(["Cascading Style Sheets"]),
          },
          {
            type: "CHECKBOX",
            text: "Which of the following are valid HTML5 structural elements?",
            options: JSON.stringify([
              "<header>",
              "<section>",
              "<navbar>",
              "<footer>",
            ]),
            correctAnswers: JSON.stringify([
              "<header>",
              "<section>",
              "<footer>",
            ]),
          },
        ],
      },
    },
  });
  console.log("Database seeded successfully!", {
    quizzes: [quiz1.title, quiz2.title],
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
