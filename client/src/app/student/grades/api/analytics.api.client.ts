import { enrollmentService } from '@/lib/api/client';
import {
  AIProgressInsight,
  ComparisonAnalyticsData,
  GetMyGradesResponse,
  GradesFilters,
  LearningRecommendation,
  Milestone,
  ModuleCompletionData,
  PerformanceHighlight,
  PerformancePrediction,
  PredictiveChartData,
  StudyTimeTrend,
} from '../schema';

/**
 * Fetches the current student's grades from the enrollment service.
 * @param filters - The filters and pagination options for the query.
 * @returns A promise that resolves to the paginated grades response.
 */
export const getMyGrades = async (
  filters: GradesFilters
): Promise<GetMyGradesResponse> => {
  try {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.q) params.append('q', filters.q);
    if (filters.courseId) params.append('courseId', filters.courseId);
    if (filters.grade) params.append('grade', filters.grade);
    if (filters.status) params.append('status', filters.status);

    const response = await enrollmentService.getTyped<GetMyGradesResponse>(
      `/api/analytics/my-grades?${params.toString()}`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch grades:', error);

    throw new Error('Could not load your grades. Please try again later.');
  }
};

/**
 * Fetches the comparison analytics (charts, ranking) for a student in a course.
 * @param courseId - The ID of the course.
 * @returns A promise that resolves to the comparison analytics data.
 */
export const getComparisonAnalytics = async (
  courseId: string
): Promise<ComparisonAnalyticsData> => {
  try {
    const response = await enrollmentService.getTyped<ComparisonAnalyticsData>(
      `/api/analytics/student/comparison/${courseId}`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch comparison analytics:', error);
    throw new Error('Could not load your performance comparison.');
  }
};

/**
 * Fetches the AI-generated performance highlights for a student.
 * @param courseId - The ID of the course (for context).
 * @returns A promise that resolves to an array of performance highlights.
 */
export const getPerformanceHighlights = async (
  courseId: string
): Promise<PerformanceHighlight[]> => {
  try {
    const response = await enrollmentService.getTyped<PerformanceHighlight[]>(
      `/api/analytics/student/performance-highlights/${courseId}`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch performance highlights:', error);
    throw new Error('Could not load AI performance insights.');
  }
};

/**
 * Fetches the AI-powered predictive performance chart data for the current student.
 * @returns A promise that resolves to an array of chart data points.
 */
export const getPredictiveChart = async (): Promise<PredictiveChartData> => {
  try {
    const response = await enrollmentService.getTyped<PredictiveChartData>(
      `/api/analytics/student/predictive-chart`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch predictive chart data:', error);
    throw new Error('Could not load your performance prediction.');
  }
};

/**
 * Fetches the AI-generated performance predictions for the current student.
 * @returns A promise that resolves to an array of prediction objects.
 */
export const getPerformancePredictions = async (): Promise<
  PerformancePrediction[]
> => {
  try {
    const response = await enrollmentService.getTyped<PerformancePrediction[]>(
      `/api/analytics/student/performance-predictions`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch performance predictions:', error);

    throw new Error('Could not load AI performance predictions.');
  }
};

/**
 * Fetches the AI-powered learning recommendations for the current student.
 * @returns A promise that resolves to an array of recommendation objects.
 */
export const getLearningRecommendations = async (): Promise<
  LearningRecommendation[]
> => {
  try {
    const response = await enrollmentService.getTyped<LearningRecommendation[]>(
      `/api/analytics/student/learning-recommendations`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch learning recommendations:', error);
    throw new Error('Could not load AI learning recommendations.');
  }
};

/**
 * Fetches the student's weekly study time trend.
 * @returns A promise that resolves to an array of weekly trend data.
 */
export const getStudyTimeTrend = async (): Promise<StudyTimeTrend[]> => {
  try {
    const response = await enrollmentService.getTyped<StudyTimeTrend[]>(
      `/api/analytics/student/study-time-trend`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch study time trend:', error);
    throw new Error('Could not load your study time trend.');
  }
};

/**
 * Fetches the student's overall module completion statistics.
 * @returns A promise that resolves to an array of completion data for the pie chart.
 */
export const getModuleCompletion = async (): Promise<ModuleCompletionData> => {
  try {
    const response = await enrollmentService.getTyped<ModuleCompletionData>(
      `/api/analytics/student/module-completion`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch module completion data:', error);

    throw new Error('Could not load your module completion stats.');
  }
};

/**
 * Fetches the AI-powered progress insights for the current student.
 * @returns A promise that resolves to an array of insight objects.
 */
export const getAIProgressInsights = async (): Promise<AIProgressInsight[]> => {
  try {
    const response = await enrollmentService.getTyped<AIProgressInsight[]>(
      `/api/analytics/student/ai-progress-insights`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch AI progress insights:', error);
    throw new Error('Could not load your AI-powered insights.');
  }
};

/**
 * Fetches the student's aggregated learning milestones timeline.
 * @returns A promise that resolves to an array of milestone objects.
 */
export const getLearningMilestones = async (): Promise<Milestone[]> => {
  try {
    const response = await enrollmentService.getTyped<Milestone[]>(
      `/api/analytics/student/learning-milestones`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch learning milestones:', error);
    throw new Error('Could not load your learning milestones.');
  }
};
