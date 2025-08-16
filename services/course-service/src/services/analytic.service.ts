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
}
