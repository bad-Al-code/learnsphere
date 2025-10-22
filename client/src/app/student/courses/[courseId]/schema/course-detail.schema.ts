import { z } from 'zod';

export const lessonSchema = z.object({
  id: z.uuid(),
  moduleId: z.uuid(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['video', 'text', 'quiz', 'assignment', 'audio', 'resource']),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  duration: z.number().optional(),
  completed: z.boolean().default(false),
  locked: z.boolean().default(false),
  order: z.number(),
  subtitles: z
    .array(
      z.object({
        lang: z.string(),
        label: z.string(),
        src: z.string(),
      })
    )
    .optional(),
  transcript: z.string().optional(),
  bookmarked: z.boolean().default(false),
  timeSpent: z.number().default(0),
  lastAccessed: z.iso.datetime().optional(),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  points: z.number().default(1),
});

export const quizSchema = z.object({
  id: z.uuid(),
  lessonId: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(quizQuestionSchema),
  timeLimit: z.number().optional(),
  passingScore: z.number().default(70),
  totalPoints: z.number(),
  attempts: z
    .array(
      z.object({
        id: z.string(),
        score: z.number(),
        percentage: z.number(),
        answers: z.record(z.string(), z.string()),
        completedAt: z.iso.datetime(),
        passed: z.boolean(),
      })
    )
    .default([]),
  maxAttempts: z.number().optional(),
});

export const assignmentSubmissionSchema = z.object({
  id: z.uuid(),
  submittedAt: z.iso.datetime(),
  content: z.string(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        size: z.number(),
      })
    )
    .optional(),
  feedback: z.string().optional(),
  score: z.number().optional(),
  maxScore: z.number(),
  gradedAt: z.iso.datetime().optional(),
  status: z.enum(['pending', 'graded', 'resubmit-required']),
});

export const assignmentSchema = z.object({
  id: z.uuid(),
  lessonId: z.uuid(),
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  dueDate: z.iso.datetime().optional(),
  maxScore: z.number().default(100),
  rubric: z
    .array(
      z.object({
        criteria: z.string(),
        maxPoints: z.number(),
        description: z.string(),
      })
    )
    .optional(),
  submissions: z.array(assignmentSubmissionSchema).default([]),
  allowLateSubmission: z.boolean().default(false),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});

export const resourceSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['pdf', 'link', 'document', 'code', 'image', 'video']),
  url: z.string(),
  downloadable: z.boolean().default(true),
  fileSize: z.string().optional(),
  downloadCount: z.number().default(0),
});

export const moduleSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  title: z.string(),
  description: z.string(),
  lessons: z.array(lessonSchema),
  order: z.number(),
  completionPercentage: z.number().default(0),
  estimatedDuration: z.number().optional(),
  locked: z.boolean().default(false),
});

export const instructorSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

export const courseDetailSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  instructor: instructorSchema,
  progressPercentage: z.number().min(0).max(100),
  modules: z.array(moduleSchema),
  rating: z.number().default(4.5),
  totalLessons: z.number(),
  completedLessons: z.number(),
  totalStudents: z.number(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedDuration: z.number().optional(),
  lastAccessedLessonId: z.uuid().optional(),
  enrolledAt: z.iso.datetime(),
  certificates: z
    .array(
      z.object({
        id: z.string(),
        issuedAt: z.iso.datetime(),
        url: z.string(),
      })
    )
    .optional(),
});

export type Lesson = z.infer<typeof lessonSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Assignment = z.infer<typeof assignmentSchema>;
export type AssignmentSubmission = z.infer<typeof assignmentSubmissionSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Instructor = z.infer<typeof instructorSchema>;
export type CourseDetail = z.infer<typeof courseDetailSchema>;
