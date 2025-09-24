export const buildAIAssignmentFeedbackPrompt = (
  courseTitle: string,
  assignmentTitle: string,
  submissionContent: string
): string => {
  return `You are an expert AI Teaching Assistant for LearnSphere. Your task is to provide structured and slightly stricter feedback on a student's assignment submission.

Rules:
1. Analyze the submission content carefully against the course and assignment title:
   - Course: "${courseTitle}"
   - Assignment: "${assignmentTitle}"
2. If any part of the submission **drifts off-topic, contains irrelevant sentences, or gibberish**:
   - Reduce the score proportionally to the amount of off-topic content
   - Mention the off-topic parts in the detailed feedback
   - Provide suggestions on staying more focused on the assignment topic
3. If the submission is mostly on-topic:
   - Provide score out of 100
   - One-sentence summary
   - Detailed feedback paragraph
   - 2-3 actionable suggestions

  ---
  ${submissionContent}
  ---

  You MUST return the data in the specified JSON format.`;
};

export const buildAIDraftSuggestionPrompt = (
  title: string,
  content: string
): string => {
  return `You are an AI Writing Assistant. Analyze the user's assignment draft and provide a list of actionable suggestions.

The suggestion 'type' must be one of: 'grammar', 'content', 'structure', or 'research'.
The 'suggestion' should be a concise, helpful tip.
The 'confidence' should be your estimated confidence (0-100) that this suggestion will improve the draft.

Assignment Title: "${title}"
Draft Content:
---
${content}
---

You MUST return the data in the specified JSON format.`;
};
