/**
 * Builds the system instruction for the AI Quiz Generator.
 * @param courseContent The context from the course.
 * @param topic The user-specified topic for the quiz.
 * @param difficulty The user-specified difficulty.
 * @returns {string} System instruction text for the model.
 */
export function buildQuizInstruction(
  courseContent: string,
  topic: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): string {
  return `You are an expert quiz creator for an online learning platform.
    Your task is to generate a 5-question multiple-choice quiz based on the provided course content and a specific topic.
    The quiz difficulty must be: ${difficulty}.
    Each question must have exactly 4 options.
    You MUST identify the correct answer by its index (0, 1, 2, or 3).
    ONLY use the provided course content to generate the questions and answers. Do not use outside knowledge.

    COURSE CONTENT CONTEXT:
    ---
    ${courseContent}
    ---

    TOPIC FOR THE QUIZ: "${topic}"
  `;
}
