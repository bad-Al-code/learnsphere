/**
 * @openapi
 * tags:
 *   - name: Analytics
 *     description: Endpoints for retrieving statistical data for instructors and admins.
 */

import { Router } from 'express';

import { AnalyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';

const router = Router();

/**
 * @openapi
 * /api/analytics/instructor:
 *   get:
 *     summary: "[Instructor/Admin] Get statistics for the current instructor"
 *     tags: [Analytics]
 *     description: |
 *       Retrieves key performance indicators for the authenticated instructor.
 *       The statistics include the total number of students enrolled across all their courses
 *       and the total revenue generated (placeholder).
 *       This endpoint requires the user to be authenticated and have a role of 'instructor' or 'admin'.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved instructor statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudents:
 *                   type: integer
 *                   description: The total number of unique students across all courses.
 *                   example: 150
 *                 totalRevenue:
 *                   type: number
 *                   description: The total revenue generated (currently a placeholder).
 *                   example: 0
 *       '401':
 *         description: Not authorized due to missing or invalid authentication token.
 *       '403':
 *         description: Forbidden. The user does not have the required role ('instructor' or 'admin').
 */
router.get(
  '/instructor',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getInstructorStats
);

/**
 * @openapi
 * /api/analytics/instructor/trends:
 *   get:
 *     summary: "[Instructor/Admin] Get monthly enrollment and revenue trends"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of monthly trend data for the last 6 months.
 */
router.get(
  '/instructor/trends',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getInstructorTrends
);

/**
 * @openapi
 * /api/analytics/instructor/grade-distribution:
 *   get:
 *     summary: "[Instructor] Get the grade distribution for all students"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of grade brackets and student counts.
 */
router.get(
  '/instructor/grade-distribution',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getGradeDistribution
);

/**
 * @openapi
 * /api/analytics/instructor/student-performance-overview:
 *   get:
 *     summary: "[Instructor] Get top and at-risk students across all courses"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An object containing lists of top performers and students at risk.
 */
router.get(
  '/instructor/student-performance-overview',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getStudentPerformanceOverview
);

/**
 * @openapi
 * /api/analytics/instructor/engagement-distribution:
 *   get:
 *     summary: "[Instructor] Get the distribution of student engagement activities"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of engagement activities and their counts.
 */
router.get(
  '/instructor/engagement-distribution',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getEngagementDistribution
);

/**
 * @openapi
 * /api/analytics/instructor/course-performance:
 *   get:
 *     summary: "[Instructor/Admin] Get performance metrics for each of the instructor's courses"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of performance data for each course.
 */
router.get(
  '/instructor/course-performance',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getInstructorCoursePerformance
);

router.get(
  '/instructor/demographics',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getDemographicAndDeviceStats
);

/**
 * @openapi
 * /api/analytics/instructor/top-students:
 *   get:
 *     summary: "[Instructor/Admin] Get top 5 performing students"
 *     tags: [Analytics]
 *     description: Retrieves the top 5 students across all of the instructor's courses, ranked by completion progress.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of the top 5 student enrollments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                   courseId:
 *                     type: string
 *                     format: uuid
 *                   progress:
 *                     type: string
 *                     format: decimal
 *                   lastActive:
 *                     type: string
 *                     format: date-time
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get(
  '/instructor/top-students',
  requireAuth,
  requireRole(['admin', 'instructor']),
  AnalyticsController.getTopStudents
);

/**
 * @openapi
 * /api/analytics/instructor/module-progress:
 *   get:
 *     summary: "[Instructor/Admin] Get progress distribution across modules"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of objects representing progress for each module.
 */
router.get(
  '/instructor/module-progress',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getModuleProgress
);

/**
 * @openapi
 * /api/analytics/instructor/weekly-engagement:
 *   get:
 *     summary: "[Instructor/Admin] Get weekly engagement data"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of objects representing engagement metrics for the past 7 days.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Mon"
 *                   logins:
 *                     type: integer
 *                     example: 5
 *                   discussions:
 *                     type: integer
 *                     example: 3
 *                   avgTime:
 *                     type: number
 *                     format: float
 *                     example: 2.1
 *       '401':
 *         description: Unauthorized – User is not authenticated.
 *       '403':
 *         description: Forbidden – User does not have instructor or admin role.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  '/instructor/weekly-engagement',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getWeeklyEngagement
);

/**
 * @openapi
 * /api/analytics/instructor/learning-analytics:
 *   get:
 *     summary: "[Instructor/Admin] Get learning analytics metrics"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of objects representing learning analytics metrics for the radar chart.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subject:
 *                     type: string
 *                     example: "Content Engagement"
 *                   current:
 *                     type: integer
 *                     example: 85
 *                   target:
 *                     type: integer
 *                     example: 90
 *       '401':
 *         description: Unauthorized – User is not authenticated.
 *       '403':
 *         description: Forbidden – User does not have instructor or admin role.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  '/instructor/learning-analytics',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getLearningAnalytics
);

/**
 * @openapi
 * /api/analytics/instructor/discussion-engagement:
 *   get:
 *     summary: "[Instructor] Get discussion engagement metrics"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An object containing total discussion count and a scaled engagement score.
 */
router.get(
  '/instructor/discussion-engagement',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getDiscussionEngagement
);

/**
 * @openapi
 * /api/analytics/my-average-grade:
 *   get:
 *     summary: "[Student] Get the current user's overall average grade"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The user's average grade.
 */
router.get(
  '/my-average-grade',
  requireAuth,
  AnalyticsController.getMyAverageGrade
);

/**
 * @openapi
 * /api/analytics/my-leaderboard-stats:
 *   get:
 *     summary: "[Student] Get leaderboard and personal stats"
 *     tags:
 *       - Analytics
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The user's leaderboard and detailed personal stats.
 */
router.get(
  '/my-leaderboard-stats',
  requireAuth,
  AnalyticsController.getMyLeaderboardStats
);

/**
 * @openapi
 * /api/analytics/my-study-streak:
 *   get:
 *     summary: "[Student] Get the current user's study streak"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The user's current study streak.
 */
router.get(
  '/my-study-streak',
  requireAuth,
  AnalyticsController.getMyStudyStreak
);

/**
 * @openapi
 * /api/analytics/my-study-trend:
 *   get:
 *     summary: "[Student] Get the current user's study time trend for the last 7 days"
 *     tags:
 *       - Analytics
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of objects with day and hours studied.
 */
router.get('/my-study-trend', requireAuth, AnalyticsController.getMyStudyTrend);

/**
 * @openapi
 * /api/analytics/live-activity-feed:
 *   get:
 *     summary: Get a feed of recent platform-wide student activities
 *     tags:
 *       - Analytics
 *     responses:
 *       '200':
 *         description: An array of recent activity events.
 */
router.get(
  '/live-activity-feed',
  requireAuth,
  AnalyticsController.getLiveActivityFeed
);

/**
 * @openapi
 * /api/analytics/my-insights:
 *   get:
 *     summary: "[Student] Get personalized AI-generated learning insights"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of personalized insight objects.
 */
router.get('/my-insights', requireAuth, AnalyticsController.getMyInsights);

/**
 * @openapi
 * /api/analytics/course/{courseId}/stats:
 *   get:
 *     summary: "[Internal] Get statistics for a single course"
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: Aggregated statistics for the course.
 */
router.get('/course/:courseId/stats', AnalyticsController.getCourseStats);

/**
 * @openapi
 * /api/analytics/course/{courseId}/module-performance:
 *   get:
 *     summary: "[Instructor] Get performance metrics for each module in a course"
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: An array of performance data for each module.
 */
router.get(
  '/course/:courseId/module-performance',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getModulePerformance
);

/**
 * @openapi
 * /course/{courseId}/activity-stats:
 *   get:
 *     summary: Get activity stats for a course
 *     description: Returns time-based and aggregate analytics for a single course, including enrollments, discussions, and recent activity.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the course.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course activity statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollmentChange:
 *                   type: number
 *                   description: Percentage change in enrollments (last 30 days vs previous 30 days).
 *                 totalDiscussions:
 *                   type: integer
 *                   description: Total number of discussion posts for this course.
 *                 recentActivity:
 *                   type: array
 *                   description: Last 5 recorded activity events.
 *                   items:
 *                     type: object
 *                 resourceDownloads:
 *                   type: integer
 *                   description: Number of resource downloads (currently placeholder).
 *                 avgSessionTime:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       example: "12m"
 *                     change:
 *                       type: number
 *                       example: 5
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient role)
 *       500:
 *         description: Server error
 */
router.get(
  '/course/:courseId/activity-stats',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getCourseActivityStats
);

/**
 * @openapi
 * /api/analytics/course/{courseId}/student-performance:
 *   get:
 *     summary: "[Instructor] Get top performers and at-risk students for a course"
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: An object containing lists of top performers and at-risk students.
 */
router.get(
  '/course/:courseId/student-performance',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getStudentPerformance
);

/**
 * @openapi
 * /course/{courseId}/session-time:
 *   get:
 *     summary: Get average session time for a course
 *     description: >
 *       Retrieves the average time a user spends in a course session, calculated
 *       from enrollment to their last access time. This endpoint is restricted
 *       to users with 'instructor' or 'admin' roles.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           example: "crs_a1b2c3d4e5f6"
 *         description: The unique identifier of the course.
 *     responses:
 *       200:
 *         description: Successfully retrieved the average session time.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                   description: The average session time formatted in minutes (e.g., "45m").
 *                   example: "45m"
 *                 change:
 *                   type: number
 *                   description: A placeholder indicating the change over a previous period (currently always 0).
 *                   example: 0
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       403:
 *         description: Forbidden. User does not have the required role ('instructor' or 'admin').
 *       404:
 *         description: Course not found or no enrollment data available.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/course/:courseId/session-time',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getAverageSessionTime
);

/**
 * @openapi
 * /api/analytics/course/{courseId}/time-spent:
 *   get:
 *     summary: "[Instructor] Get time-spent analytics for a course"
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: An object containing average session time and total time spent per module.
 */
router.get(
  '/course/:courseId/time-spent',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getTimeSpentAnalytics
);

/**
 * @openapi
 * /api/analytics/instructor/overall-stats:
 *   get:
 *     summary: "[Instructor] Get high-level stats for the analytics page"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An object containing aggregated stats like avg grade and completion.
 */
router.get(
  '/instructor/overall-stats',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getOverallStats
);

/**
 * @openapi
 * /api/analytics/instructor/engagement-score:
 *   get:
 *     summary: "[Instructor] Get a calculated engagement score"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An object containing the score and change percentage.
 */
router.get(
  '/instructor/engagement-score',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getEngagementScore
);

/**
 * @openapi
 * /instructor/request-report:
 *   post:
 *     summary: "[Instructor] Request a new analytics report"
 *     tags: [Analytics]
 *     requestBody:
 *       description: Report request details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportType:
 *                 type: string
 *                 example: "student_performance"
 *               format:
 *                 type: string
 *                 enum: [csv, pdf]
 *                 example: "pdf"
 *     responses:
 *       202:
 *         description: Report generation started
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post(
  '/instructor/request-report',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.requestReport
);

/**
 * @openapi
 * /api/analytics/instructor/student-grade/{courseId}/{studentId}:
 *   get:
 *     summary: "[Instructor] Get a student's average grade for a course"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: An object containing the student's average numerical and letter grade.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageGrade:
 *                   type: number
 *                   nullable: true
 *                   example: 85.5
 *                 letterGrade:
 *                   type: string
 *                   nullable: true
 *                   example: "B"
 */
router.get(
  '/instructor/student-grade/:courseId/:studentId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getStudentGrade
);

export { router as analyticsRouter };
