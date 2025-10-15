import { z } from 'zod';

export const courseIdParamsSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .uuid('Invalid course ID format')
      .min(1, 'Course ID is required'),
  }),
});

export type CourseIdParams = z.infer<typeof courseIdParamsSchema>;

export const assignmentSchema = z.object({
  id: z.string().uuid(),
  dueDate: z.date().nullable(),
});

export type Assignment = z.infer<typeof assignmentSchema>;

export const studentGradeDbSchema = z.object({
  id: z.string().uuid(),
  submissionId: z.string().uuid(),
  assignmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  moduleId: z.string().uuid().nullable(),
  studentId: z.string().uuid(),
  grade: z.number().int().min(0).max(100),
  gradedAt: z.date(),
});

export type StudentGradeDb = z.infer<typeof studentGradeDbSchema>;

export const gradeRowSchema = z.object({
  grade_bracket: z.enum([
    'A+',
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D',
    'F',
  ]),
  student_count: z.string().or(z.number()),
});

export type GradeRow = z.infer<typeof gradeRowSchema>;

export const rawAnalyticsDataSchema = z.object({
  totalSubmissions: z.number().int().min(0),
  averageGrade: z.number().min(0).max(100),
  onTimeRate: z.number().min(0).max(1),
  onTimeCount: z.number().int().min(0),
});

export type RawAnalyticsData = z.infer<typeof rawAnalyticsDataSchema>;

export const onTimeSubmissionDataSchema = z.object({
  onTimeRate: z.number().min(0).max(1),
  onTimeCount: z.number().int().min(0),
});

export type OnTimeSubmissionData = z.infer<typeof onTimeSubmissionDataSchema>;

export const monthlyTrendSchema = z.object({
  month: z.string().min(1, 'Month cannot be empty'),
  submissions: z.number().int().min(0),
  grade: z.number().min(0).max(100),
});

export type MonthlyTrend = z.infer<typeof monthlyTrendSchema>;

export const gradeDistributionItemSchema = z.object({
  grade: z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']),
  value: z.number().int().min(0),
});
export type GradeDistributionItem = z.infer<typeof gradeDistributionItemSchema>;

export const statCardSchema = z.object({
  title: z.string().min(1),
  value: z.string().min(1),
  change: z.string().optional(),
  description: z.string().optional(),
  Icon: z.string().min(1),
});

export type StatCard = z.infer<typeof statCardSchema>;

export const trendDataSchema = z.object({
  month: z.string().min(1),
  submissions: z.number().int().min(0),
  grade: z.number().min(0).max(100),
});

export type TrendData = z.infer<typeof trendDataSchema>;

export const gradeDistributionSchema = z.object({
  grade: z.string().min(1),
  value: z.number().int().min(0),
  fill: z.string().min(1),
});

export type GradeDistribution = z.infer<typeof gradeDistributionSchema>;

export const performanceInsightSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  Icon: z.string().min(1),
  color: z.string().min(1),
});

export type PerformanceInsight = z.infer<typeof performanceInsightSchema>;

export const assignmentAnalyticsSchema = z.object({
  stats: z.array(statCardSchema).min(1).max(10),
  trends: z.array(trendDataSchema).max(12),
  gradeDistribution: z.array(gradeDistributionSchema).max(11),
  insights: z.array(performanceInsightSchema).max(10),
});

export type AssignmentAnalytics = z.infer<typeof assignmentAnalyticsSchema>;

export const getMyGradesQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    courseId: z.string().optional(),
    grade: z.string().optional(),
    status: z.enum(['Graded', 'Pending']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type GetMyGradesQuery = z.infer<typeof getMyGradesQuerySchema>['query'];

export enum ReportType {
  STUDENT_GRADES = 'student_grades',
  STUDENT_PERFORMANCE = 'student_performance',
}

export enum ReportFormat {
  CSV = 'csv',
  PDF = 'pdf',
}

export const requestReportSchema = z.object({
  body: z.object({
    reportType: z.nativeEnum(ReportType),
    format: z.nativeEnum(ReportFormat),
  }),
});

export type RequestReportInput = z.infer<typeof requestReportSchema>['body'];

export const submissionIdParamsSchema = z.object({
  params: z.object({
    submissionId: z.string().uuid('Invalid submission ID format'),
  }),
});

export const performanceHighlightSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export const comparisonAnalyticsResponseSchema = z.object({
  performanceChart: z.array(
    z.object({
      subject: z.string(),
      yourScore: z.number(),
      classAverage: z.number(),
    })
  ),

  classRanking: z.object({
    rank: z.number().nullable(),
    totalStudents: z.number(),
    topStudents: z.array(
      z.object({
        rank: z.number(),
        name: z.string(),
        score: z.number(),
      })
    ),
  }),
  highlights: z.array(performanceHighlightSchema),
});

export type ComparisonAnalyticsResponse = z.infer<
  typeof comparisonAnalyticsResponseSchema
>;

export const studyTimeTrendSchema = z.object({
  week: z.string(),
  studyHours: z.number(),
  target: z.number(),
});

export type StudyTimeTrend = z.infer<typeof studyTimeTrendSchema>;

export const ModuleStatusEnum = z.enum([
  'Completed',
  'In Progress',
  'Not Started',
]);
export type ModuleStatus = z.infer<typeof ModuleStatusEnum>;

export const moduleCompletionSchema = z.object({
  status: ModuleStatusEnum,
  value: z.number(),
  fill: z.string(),
});

export const moduleCompletionArraySchema = z.array(moduleCompletionSchema);
export type ModuleCompletionData = z.infer<typeof moduleCompletionArraySchema>;

export const studyHabitSchema = z.object({
  day: z.string(),
  efficiency: z.number(),
  focus: z.number(),
});

export type StudyHabit = z.infer<typeof studyHabitSchema>;
