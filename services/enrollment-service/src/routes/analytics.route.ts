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
