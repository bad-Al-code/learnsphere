export type GeneratedQuizQuestion = {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
};

export type GeneratedQuiz = {
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: GeneratedQuizQuestion[];
};
