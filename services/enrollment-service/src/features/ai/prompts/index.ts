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

interface PredictionContext {
  averageGrade: number;
  onTimeRate: number;
  totalSubmissions: number;
}

interface RecommendationContext {
  gradeDistribution: { grade: string; count: number }[];
  peakStudyDays: string[];
  peakStudyHours: string[];
}

interface ProgressInsightContext {
  completion: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  studyTrend: {
    averageHours: number;
    isConsistent: boolean;
  };
}

interface GradeByCategory {
  category: string;
  averageGrade: number;
}

interface DailyHabit {
  day: string;
  totalMinutes: number;
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

  /**
   * Generates the system instruction for the AI to create performance predictions.
   * @param context The student's summary performance data.
   * @returns A string containing the system prompt for the Gemini model.
   */
  public static buildPerformancePredictionPrompt(
    context: PredictionContext
  ): string {
    return `
      You are an AI academic advisor with expertise in data analysis.
      Your task is to analyze a student's summary performance data and generate exactly 3 insightful predictions about their future academic trajectory.

      Rules:
      1. The tone should be objective and data-driven, yet encouraging.
      2. Each prediction must have a 'title' and a 'description'.
      3. The first prediction's title MUST be "Grade Trajectory" and it MUST have 'highlighted' set to true.
      4. The second prediction's title MUST be "Risk Assessment".
      5. The third prediction's title MUST be "Optimization Opportunity".
      6. Base your predictions strictly on the data provided. Do not invent unrelated facts.

      Here is the student's data:
      - Overall Average Grade: ${context.averageGrade.toFixed(1)}%
      - On-Time Submission Rate: ${(context.onTimeRate * 100).toFixed(0)}%
      - Total Assignments Submitted: ${context.totalSubmissions}

      Generate the three predictions now in the specified JSON format.`;
  }

  /**
   * Generates the system instruction for the AI to create learning recommendations.
   * @param context The student's learning patterns data.
   * @returns A string containing the system prompt for the Gemini model.
   */
  public static buildLearningRecommendationPrompt(
    context: RecommendationContext
  ): string {
    const gradeString = context.gradeDistribution
      .map((g) => `${g.grade}: ${g.count} assignments`)
      .join(', ');
    const dayString = context.peakStudyDays.join(', ');
    const hourString = context.peakStudyHours.join(', ');

    return `
      You are an AI academic advisor named "LearnBot". Your task is to provide exactly 3 personalized and actionable learning recommendations based on the student's study patterns and grade distribution.

      Rules:
      1. The tone should be encouraging and specific.
      2. Each recommendation must have a 'title' and a 'description'.
      3. One recommendation should be about WHEN to study, using the peak study time data.
      4. One recommendation should be about WHAT to study, using the grade distribution data to suggest focusing on weaker areas.
      5. The third recommendation should be a more general, effective study habit.

      Here is the student's data:
      - Overall Grade Distribution: ${gradeString}
      - Most Active Study Days: ${dayString}
      - Most Active Study Hours: ${hourString}

      Generate the three recommendations now in the specified JSON format.`;
  }

  /**
   * Generates the system instruction for the AI to create progress insights.
   * @param context The student's progress and trend data.
   * @returns A string containing the system prompt for the Gemini model.
   */
  public static buildProgressInsightsPrompt(
    context: ProgressInsightContext
  ): string {
    const completionString = `Completion Status: ${context.completion.completed}% completed, ${context.completion.inProgress}% in progress.`;
    const trendString = `Study Trend: Averaging ${context.studyTrend.averageHours.toFixed(
      1
    )} hours/week. Consistency is ${context.studyTrend.isConsistent ? 'good' : 'irregular'}.`;

    return `
      You are an AI academic advisor named "InsightBot". Your task is to provide exactly 3 personalized insights based on a student's learning progress.

      Rules:
      1. The tone must be encouraging and forward-looking.
      2. Each insight must have a 'title' and a 'description'.
      3. One insight MUST be titled "Study Pace Analysis".
      4. One insight MUST be titled "Performance Trend".
      5. One insight MUST be titled "Focus Recommendation".
      6. The "Study Pace Analysis" insight MUST be marked as 'highlighted: true'.
      7. Base your insights strictly on the data provided.

      Student's Data:
      - ${completionString}
      - ${trendString}

      Generate the three insights now in the specified JSON format.`;
  }

  /**
   * Generates the system instruction for the AI to analyze learning efficiency.
   * @param gradesByCategory A list of the student's average grades grouped by category.
   * @returns A string containing the system prompt for the Gemini model.
   */
  public static buildLearningEfficiencyPrompt(
    gradesByCategory: GradeByCategory[]
  ): string {
    const gradeString = gradesByCategory
      .map((g) => `- ${g.category}: ${g.averageGrade.toFixed(1)}% Avg. Grade`)
      .join('\n');

    return `
        You are an AI learning analyst. Your task is to interpret a student's average grades across different course subjects and estimate their learning efficiency in three key areas: 'comprehension', 'retention', and 'application'.

        Rules:
        1. For each subject provided, generate integer scores from 0 to 100 for the three efficiency areas.
        2. 'Comprehension': How well the student understands the core concepts. Higher grades strongly imply higher comprehension.
        3. 'Retention': How well the student remembers information. Infer this from consistency; if all grades are high, retention is high. If grades are mixed, retention might be lower.
        4. 'Application': How well the student can apply knowledge. Infer this by assuming subjects with higher average grades indicate better application.
        5. The output must be a JSON object containing an 'efficiency' array.

        Here is the student's performance data:
        ---
        ${gradeString}
        ---

        Generate the learning efficiency analysis now.`;
  }

  /**
   * Generates the system instruction for the AI to analyze study habits.
   * @param dailyData The student's study minutes for the last 7 days.
   * @returns A string containing the system prompt for the Gemini model.
   */
  public static buildStudyHabitsPrompt(dailyData: DailyHabit[]): string {
    const habitsString = dailyData
      .map((d) => `- ${d.day}: ${d.totalMinutes} minutes`)
      .join('\n');

    return `
      You are an AI learning coach. Your task is to analyze a student's daily study minutes for the past week and generate 'efficiency' and 'focus' scores (0-100) for each day.

      Rules:
      1. 'Efficiency' reflects how well study time is distributed. Lower scores for cramming (very high minutes on one day, low on others). Higher scores for consistent, moderate daily study.
      2. 'Focus' reflects consistency. If a user studies every day, even for a short time, their focus score should be high. Missed days should lower the score.
      3. The output must be a JSON object containing a 'habits' array, with an entry for each of the 7 days of the week, even if study minutes were 0.

      Here is the student's raw study data:
      ---
      ${habitsString}
      ---

      Generate the 7-day study habit analysis now.`;
  }
}
