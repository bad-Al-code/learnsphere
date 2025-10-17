import { z } from 'zod';

export const lessonSchema = z.object({
  id: z.string().uuid(),
  moduleId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['video', 'text', 'quiz', 'assignment', 'audio', 'resource']),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  duration: z.number(),
  completed: z.boolean().default(false),
  subtitles: z
    .array(
      z.object({
        timestamp: z.number(),
        text: z.string(),
      })
    )
    .optional(),
  transcript: z.string().optional(),
  bookmarked: z.boolean().default(false),
  timeSpent: z.number().default(0),
  lastAccessed: z.string().datetime().optional(),
  notes: z
    .array(
      z.object({
        id: z.string(),
        timestamp: z.number(),
        content: z.string(),
        createdAt: z.string().datetime(),
      })
    )
    .optional(),
  comments: z
    .array(
      z.object({
        id: z.string(),
        author: z.string(),
        content: z.string(),
        createdAt: z.string().datetime(),
        replies: z.array(z.any()).optional(),
      })
    )
    .optional(),
  reactions: z
    .object({
      like: z.number().default(0),
      helpful: z.number().default(0),
      confusing: z.number().default(0),
    })
    .optional(),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
});

export const quizSchema = z.object({
  id: z.string().uuid(),
  lessonId: z.string().uuid(),
  title: z.string(),
  questions: z.array(quizQuestionSchema),
  timeLimit: z.number().optional(),
  passingScore: z.number().default(70),
  attempts: z
    .array(
      z.object({
        id: z.string(),
        score: z.number(),
        answers: z.array(z.string()),
        completedAt: z.string().datetime(),
      })
    )
    .optional(),
});

export const assignmentSchema = z.object({
  id: z.string().uuid(),
  moduleId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string().datetime(),
  points: z.number(),
  status: z.enum(['pending', 'submitted', 'graded']),
  rubric: z
    .array(
      z.object({
        criteria: z.string(),
        maxPoints: z.number(),
        description: z.string(),
      })
    )
    .optional(),
  submissions: z
    .array(
      z.object({
        id: z.string(),
        submittedAt: z.string().datetime(),
        files: z.array(
          z.object({
            name: z.string(),
            url: z.string(),
          })
        ),
        feedback: z.string().optional(),
        score: z.number().optional(),
      })
    )
    .optional(),
});

export const resourceSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['pdf', 'link', 'document', 'code', 'image']),
  url: z.string(),
  downloadable: z.boolean().default(true),
  fileSize: z.string().optional(),
  downloadCount: z.number().default(0),
});

export const moduleSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  lessons: z.array(lessonSchema),
  order: z.number(),
  completionPercentage: z.number().default(0),
  estimatedDuration: z.number(),
});

export const instructorSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
});

export const courseDetailSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  instructor: instructorSchema,
  progressPercentage: z.number(),
  modules: z.array(moduleSchema),
  assignments: z.array(assignmentSchema),
  resources: z.array(resourceSchema),
  rating: z.number().default(4.5),
  totalLessons: z.number(),
  totalStudents: z.number(),
  coverImage: z.string().optional(),
  notifications: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum([
          'assignment-due',
          'new-lesson',
          'feedback',
          'quiz-available',
        ]),
        message: z.string(),
        createdAt: z.string().datetime(),
        read: z.boolean().default(false),
      })
    )
    .optional(),
});

export type Lesson = z.infer<typeof lessonSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Assignment = z.infer<typeof assignmentSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Instructor = z.infer<typeof instructorSchema>;
export type CourseDetail = z.infer<typeof courseDetailSchema>;
