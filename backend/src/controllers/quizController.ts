import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../db";

// Validation schemas
const questionTypeSchema = z.enum(["BOOLEAN", "INPUT", "CHECKBOX"]);

const createQuestionSchema = z.object({
  type: questionTypeSchema,
  text: z.string().min(1, "Question text is required"),
  options: z.array(z.string()).default([]),
  correctAnswers: z
    .array(z.string())
    .min(1, "At least one correct answer must be provided"),
});

const createQuizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  questions: z
    .array(createQuestionSchema)
    .min(1, "At least one question is required"),
});

// Create Quiz
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const parseResult = createQuizSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { title, questions } = parseResult.data;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            type: q.type,
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswers: JSON.stringify(q.correctAnswers),
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    const parsedQuestions = quiz.questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
      correctAnswers: JSON.parse(q.correctAnswers),
    }));

    return res.status(201).json({
      ...quiz,
      questions: parsedQuestions,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Quizzes (List)
export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        questions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      createdAt: q.createdAt,
      questionCount: q.questions.length,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Single Quiz Details
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const parsedQuestions = quiz.questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
      correctAnswers: JSON.parse(q.correctAnswers),
    }));

    return res.status(200).json({
      ...quiz,
      questions: parsedQuestions,
    });
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Quiz
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
