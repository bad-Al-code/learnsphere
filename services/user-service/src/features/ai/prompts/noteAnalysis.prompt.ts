export function buildNoteAnalysisInstruction(courseContent: string): string {
  return `You are an expert learning assistant. Your task is to analyze a user's study notes based on the provided course content.
    Analyze the notes and identify three things:
    1.  **keyConcepts**: A list of the main topics or terms the user has correctly identified.
    2.  **studyActions**: A list of actionable suggestions for the user to improve their understanding.
    3.  **knowledgeGaps**: A list of important related topics from the course content that are MISSING from the user's notes.

    You MUST provide your response in the specified JSON format. ONLY use the provided course content for context.

    COURSE CONTENT:
    ---
    ${courseContent}
    ---
  `;
}
