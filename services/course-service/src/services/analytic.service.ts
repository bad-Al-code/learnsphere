import { AnalyticsRepository } from '../db/repostiories';

export class AnalyticsService {
  /**
   * Calculates and formats learning analytics metrics for the radar chart.
   * @param instructorId The instructor's UUID.
   * @returns An object containing calculated metrics.
   */
  public static async getLearningAnalytics(instructorId: string) {
    const { timelinessData, totalResources, totalDownloads, totalStudents } =
      await AnalyticsRepository.getLearningAnalyticsRawData(instructorId);

    const onTimeSubmissions = timelinessData.filter(
      (s) => s.dueDate && s.submittedAt <= s.dueDate
    ).length;
    const timeliness =
      timelinessData.length > 0
        ? Math.round((onTimeSubmissions / timelinessData.length) * 100)
        : 0;

    const expectedDownloads = totalResources * totalStudents;
    const utilization =
      expectedDownloads > 0
        ? Math.round((totalDownloads / expectedDownloads) * 100)
        : 0;

    return { timeliness, utilization };
  }

  /**
   * Calculates and formats data for the Content Performance Analysis table.
   * @param instructorId The instructor's UUID.
   * @returns An array of formatted data rows for the table.
   */
  public static async getContentPerformance(instructorId: string) {
    const rawData =
      await AnalyticsRepository.getContentPerformanceRawData(instructorId);

    // NOTE: Several metrics here are placeholders as they require features
    // we have not built yet (e.g., student ratings, video watch time tracking).
    const performanceData = [
      {
        contentType: 'Video Lectures',
        engagementRate: 92, // Placeholder
        completionRate: 88, // Placeholder
        averageRating: 4.7, // Placeholder
        performance: 'Excellent' as const,
      },
      {
        contentType: 'Interactive Quizzes',
        engagementRate: 85, // Placeholder
        completionRate: 94, // Placeholder
        averageRating: 4.5, // Placeholder
        performance: 'Excellent' as const,
      },
      {
        contentType: 'Reading Materials',
        engagementRate: 68, // Placeholder
        completionRate: 72, // Placeholder
        averageRating: 4.2, // Placeholder
        performance: 'Good' as const,
      },
      {
        contentType: 'Assignments',
        engagementRate: 78, // Placeholder
        completionRate: 85, // Placeholder
        averageRating:
          rawData.assignments.averageGrade > 0
            ? rawData.assignments.averageGrade / 20
            : 4.4,
        performance: 'Good' as const,
      },
      {
        contentType: 'Discussion Forums',
        engagementRate: 65, // Placeholder
        completionRate: 45, // Placeholder
        averageRating: 4.3, // Placeholder
        performance: 'Good' as const,
      },
    ];

    return performanceData;
  }
}
