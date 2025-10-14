interface PerformanceContext {
  rank: number | null;
  totalStudents: number;
  bestCourse: {
    subject: string;
    yourScore: number;
  } | null;
  averagePerformance: number;
}

interface GradeHistoryItem {
  month: string;
  averageGrade: number;
}

export class AIPrompt {
  /**
   * Generates the system instruction for the AI to create performance highlights.
   * @param context The student's performance data.
   * @returns A string containing the system prompt for the Gemini model.
   */
  public static buildPerformanceHighlightsPrompt(
    context: PerformanceContext
  ): string {
    const performanceStatement = `Overall, they are performing ${Math.round(
      (context.averagePerformance - 1) * 100
    )}% ${
      context.averagePerformance >= 1 ? 'above' : 'below'
    } the class average.`;

    let rankStatement = '';
    if (context.rank && context.totalStudents > 0) {
      const percentile =
        ((context.totalStudents - context.rank) / context.totalStudents) * 100;
      rankStatement = `In their primary course, they are ranked #${
        context.rank
      } out of ${context.totalStudents} students, placing them in the top ${
        100 - Math.floor(percentile)
      }%.`;
    }

    const bestCourseStatement = context.bestCourse
      ? `Their best subject is "${context.bestCourse.subject}," with a score of ${context.bestCourse.yourScore}%.`
      : '';

    return `
You are an encouraging and insightful academic advisor named "InsightAI".
Your task is to analyze a student's performance data and provide exactly 4 concise, actionable, and personalized insights.

- The tone must be positive and motivational.
- Each insight must have a 'title', a 'description', a 'level' ('high', 'medium', or 'low'), and an 'actionButtonText'.
- Do not invent new data. Base your insights strictly on the context provided.
- One insight for rank: If top 25%, level 'high'. If top 50%, 'medium'. Otherwise, 'low'. Action button should be 'View Leaderboard'.
- One insight for best subject. Level 'high'. Action button should be 'Review Course'.
- One insight for overall performance vs. average. Level 'medium'. Action button should be 'View Analytics'.
- One insight for consistency or a general motivational message. Level 'low'. Action button should be 'Keep Going'.

Here is the student's data:
- ${performanceStatement}
- ${rankStatement}
- ${bestCourseStatement}

You MUST return the data in the specified JSON format.`;
  }

  /**
   * Generates the system instruction for the AI to predict future performance.
   * @param gradeHistory A list of the student's recent average grades by month.
   * @returns A string containing the system prompt for the Gemini model.
   */
  public static buildPredictiveChartPrompt(
    gradeHistory: GradeHistoryItem[]
  ): string {
    const historyString = gradeHistory
      .map((item) => `- ${item.month}: ${item.averageGrade.toFixed(1)}%`)
      .join('\n');

    return `
You are a data scientist AI specializing in academic performance prediction.
Your task is to analyze a student's grade history and predict their average grade for the next 4 months.

Rules:
1. Analyze the trend from the provided history.
2. For each of the next 4 months, provide a 'predicted' grade and a 'confidence' score (0-100).
3. The confidence score should reflect the stability of the past data. More erratic history means lower confidence.
4. The output must be a JSON object containing a 'predictions' array with exactly 4 entries.

Here is the student's recent grade history (monthly average):
---
${historyString}
---

Generate the predictions now.`;
  }
}
