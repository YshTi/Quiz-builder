export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function fetchQuizzes(): Promise<QuizSummary[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes`);
  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }
  return response.json();
}

export async function fetchQuizById(id: string): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Quiz not found');
    }
    throw new Error('Failed to fetch quiz details');
  }
  return response.json();
}

export async function createQuiz(quiz: { title: string; questions: Omit<Question, 'id'>[] }): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quiz),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create quiz');
  }
  
  return response.json();
}

export async function deleteQuiz(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete quiz');
  }
}
