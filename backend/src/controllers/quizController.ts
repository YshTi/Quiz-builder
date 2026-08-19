import { Request, Response } from "express";

import prisma from "../db";
import { createQuizSchema } from "../schemas/quizSchema";
import { parseQuestion, serializeQuestion } from "../utils/questionMapper";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const parseResult = createQuizSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten(),
      });
    }

    const { title, questions } = parseResult.data;

    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),

        questions: {
          create: questions.map(serializeQuestion),
        },
      },

      include: {
        questions: true,
      },
    });

    return res.status(201).json({
      ...quiz,

      questions: quiz.questions.map(parseQuestion),
    });
  } catch (error) {
    console.error("Error creating quiz:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getQuizzes = async (_req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,

        _count: {
          select: {
            questions: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const result = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      questionCount: quiz._count.questions,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching quizzes:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: {
        id,
      },

      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({
        error: "Quiz not found",
      });
    }

    return res.status(200).json({
      ...quiz,

      questions: quiz.questions.map(parseQuestion),
    });
  } catch (error) {
    console.error("Error fetching quiz details:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({
        error: "Quiz not found",
      });
    }

    await prisma.quiz.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
