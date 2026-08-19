export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface Question {
  id?: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswers: string[];
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: string;
  title: string;
  createdAt: string;
  questionCount: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

async function getApiError(
  response: Response,
  fallbackMessage: string,
): Promise<Error> {
  const payload = await response.json().catch(() => null);

  if (payload && typeof payload.error === "string") {
    return new Error(payload.error);
  }

  return new Error(fallbackMessage);
}

export async function fetchQuizzes(): Promise<QuizSummary[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes`);

  if (!response.ok) {
    throw await getApiError(response, "Failed to fetch quizzes");
  }

  return response.json();
}

export async function fetchQuizById(id: string): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);

  if (!response.ok) {
    throw await getApiError(
      response,
      response.status === 404
        ? "Quiz not found"
        : "Failed to fetch quiz details",
    );
  }

  return response.json();
}

export async function createQuiz(quiz: {
  title: string;

  questions: Omit<Question, "id">[];
}): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(quiz),
  });

  if (!response.ok) {
    throw await getApiError(response, "Failed to create quiz");
  }

  return response.json();
}

export async function deleteQuiz(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await getApiError(response, "Failed to delete quiz");
  }
}
