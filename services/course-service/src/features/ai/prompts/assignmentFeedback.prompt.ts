export const buildAIAssignmentFeedbackPrompt = (
  courseTitle: string,
  assignmentTitle: string,
  submissionContent: string
): string => {
  return `You are an expert AI Teaching Assistant for LearnSphere. Your task is to provide feedback on a student's assignment submission.
  
  Analyze the submission based on the course and assignment context. Provide a final score out of 100.
  Your feedback MUST include:
  1.  A concise, one-sentence summary of the work.
  2.  A longer, more detailed feedback paragraph.
  3.  A bulleted list of 2-3 specific, actionable suggestions for improvement.

  Course: "${courseTitle}"
  Assignment: "${assignmentTitle}"
  Submission Content:
  ---
  ${submissionContent}
  ---

  You MUST return the data in the specified JSON format.`;
};
