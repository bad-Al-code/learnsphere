export function buildDraftInstruction(
  courseContent: string,
  userPrompt: string
): string {
  return `You are an academic writing assistant. Your task is to generate a well-structured draft based on the user's prompt and the provided course content.
  The draft should be written in clear, academic language. Structure the response with paragraphs and use markdown for formatting.
  
    COURSE CONTENT CONTEXT:
    ---
    ${courseContent}
    ---

    USER'S WRITING PROMPT: "${userPrompt}"
  `;
}

export function buildFeedbackInstruction(
  courseContent: string,
  userContent: string,
  feedbackType: 'Grammar' | 'Style' | 'Clarity' | 'Argument'
): string {
  const baseInstruction = `You are an expert writing tutor. Analyze the user's text based on the provided course content and the requested feedback type.
  Your goal is to provide specific, constructive suggestions for improvement. Identify sentences or phrases that can be improved.
  For each suggestion, provide the original text, your suggested improvement, and a brief explanation for the change.
  
    COURSE CONTENT CONTEXT:
    ---
    ${courseContent}
    ---

    USER'S TEXT TO ANALYZE:
    ---
    ${userContent}
    ---
  `;

  switch (feedbackType) {
    case 'Grammar':
      return (
        baseInstruction +
        '\nFocus specifically on correcting grammatical errors, spelling mistakes, and punctuation.'
      );
    case 'Style':
      return (
        baseInstruction +
        '\nFocus on improving the writing style, tone, word choice, and sentence structure to make it more academic and engaging.'
      );
    case 'Clarity':
      return (
        baseInstruction +
        '\nFocus on improving the clarity and conciseness of the text. Identify ambiguous phrases or convoluted sentences.'
      );
    case 'Argument':
      return (
        baseInstruction +
        '\nFocus on the strength and coherence of the argument. Identify logical fallacies, weak points, or areas that need more evidence based on the course content.'
      );
    default:
      return baseInstruction;
  }
}
