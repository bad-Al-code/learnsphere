export function buildFlashcardInstruction(
  courseContent: string,
  topic: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): string {
  return `You are an expert instructional designer. Your task is to generate a set of 10 high-quality flashcards based on the provided course content and a specific topic.

  The flashcards must be for a ${difficulty} level.
  Each flashcard must be a distinct question-and-answer pair.
  The "question" should be a clear, concise question.
  The "answer" should be a clear, concise answer to that question.
  
  ONLY use the provided course content to generate the questions and answers. Do not use outside knowledge.
  You MUST provide your response in the specified JSON format.

  COURSE CONTENT CONTEXT:
  ---
  ${courseContent}
  ---

  TOPIC FOR THE FLASHCARDS: "${topic}"
  `;
}
