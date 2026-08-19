import { z } from "zod";

export const questionTypeSchema = z.enum(["BOOLEAN", "INPUT", "CHECKBOX"]);

export const createQuestionSchema = z
  .object({
    type: questionTypeSchema,

    text: z.string().trim().min(1, "Question text is required"),

    options: z.array(z.string()).default([]),

    correctAnswers: z
      .array(z.string())
      .min(1, "At least one correct answer must be provided"),
  })
  .superRefine((question, ctx) => {
    if (question.type === "BOOLEAN") {
      const hasValidOptions =
        question.options.length === 2 &&
        question.options[0] === "True" &&
        question.options[1] === "False";

      if (!hasValidOptions) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message:
            'Boolean questions must use exactly ["True", "False"] as options',
        });
      }

      if (
        question.correctAnswers.length !== 1 ||
        !["True", "False"].includes(question.correctAnswers[0])
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswers"],
          message:
            "Boolean questions must have exactly one correct answer: True or False",
        });
      }

      return;
    }

    if (question.type === "INPUT") {
      if (question.options.length !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Short-answer questions must not contain options",
        });
      }

      if (
        question.correctAnswers.length !== 1 ||
        question.correctAnswers[0].trim().length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswers"],
          message:
            "Short-answer questions must contain exactly one non-empty correct answer",
        });
      }

      return;
    }

    if (question.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Checkbox questions must contain at least two options",
      });
    }

    const trimmedOptions = question.options.map((option) => option.trim());

    if (trimmedOptions.some((option) => option.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Checkbox options cannot be empty",
      });
    }

    const normalizedOptions = trimmedOptions.map((option) =>
      option.toLowerCase(),
    );

    if (new Set(normalizedOptions).size !== normalizedOptions.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Checkbox options must be unique",
      });
    }

    if (question.correctAnswers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswers"],
        message: "Select at least one correct checkbox answer",
      });
    }

    const invalidCorrectAnswer = question.correctAnswers.some(
      (answer) => !question.options.includes(answer),
    );

    if (invalidCorrectAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswers"],
        message: "Correct answers must exist in the options list",
      });
    }
  });

export const createQuizSchema = z.object({
  title: z.string().trim().min(3, "Quiz title must be at least 3 characters"),

  questions: z
    .array(createQuestionSchema)
    .min(1, "At least one question is required"),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
