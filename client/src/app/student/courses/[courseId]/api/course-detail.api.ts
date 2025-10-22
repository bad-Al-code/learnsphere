import { faker } from '@faker-js/faker';
import {
  type Assignment,
  assignmentSchema,
  type CourseDetail,
  courseDetailSchema,
  type Lesson,
  type Module,
  type Quiz,
  quizSchema,
  type Resource,
} from '../schema/course-detail.schema';

const LESSON_TYPES = [
  'video',
  'text',
  'quiz',
  'assignment',
  'audio',
  'resource',
] as const;

function generateQuiz(lessonId: string): Quiz {
  const questions = Array.from(
    { length: faker.number.int({ min: 3, max: 8 }) },
    (_, i) => {
      const type = faker.helpers.arrayElement([
        'multiple-choice',
        'true-false',
      ] as const);
      return {
        id: faker.string.uuid(),
        question: faker.lorem.sentence() + '?',
        type,
        options:
          type === 'multiple-choice'
            ? Array.from({ length: 4 }, () => faker.lorem.words(3))
            : type === 'true-false'
              ? ['True', 'False']
              : undefined,
        correctAnswer:
          type === 'multiple-choice'
            ? faker.helpers.arrayElement(['0', '1', '2', '3'])
            : faker.helpers.arrayElement(['0', '1']),
        explanation: faker.lorem.sentence(),
        points: faker.number.int({ min: 1, max: 5 }),
      };
    }
  );

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return {
    id: faker.string.uuid(),
    lessonId,
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    questions,
    timeLimit: faker.helpers.maybe(() =>
      faker.number.int({ min: 10, max: 60 })
    ),
    passingScore: 70,
    totalPoints,
    attempts: [],
    maxAttempts: faker.helpers.maybe(() =>
      faker.number.int({ min: 1, max: 3 })
    ),
  };
}

function generateAssignment(lessonId: string): Assignment {
  return {
    id: faker.string.uuid(),
    lessonId,
    title: faker.lorem.words(4),
    description: faker.lorem.sentence(),
    instructions: faker.lorem.paragraphs(2),
    dueDate: faker.helpers.maybe(() => faker.date.future().toISOString()),
    maxScore: 100,
    rubric: Array.from(
      { length: faker.number.int({ min: 2, max: 4 }) },
      () => ({
        criteria: faker.lorem.words(3),
        maxPoints: faker.number.int({ min: 10, max: 30 }),
        description: faker.lorem.sentence(),
      })
    ),
    submissions: [],
    allowLateSubmission: faker.datatype.boolean(),
    attachments: faker.helpers.maybe(() =>
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        name: `${faker.system.fileName()}.pdf`,
        url: faker.internet.url(),
      }))
    ),
  };
}

function generateResources(count: number): Resource[] {
  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement([
      'pdf',
      'link',
      'document',
      'code',
      'image',
      'video',
    ] as const);
    return {
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      type,
      url: faker.internet.url(),
      downloadable: type !== 'link',
      fileSize:
        type !== 'link'
          ? `${faker.number.int({ min: 100, max: 9999 })} KB`
          : undefined,
      downloadCount: faker.number.int({ min: 0, max: 500 }),
    };
  });
}

function generateLesson(
  moduleId: string,
  order: number,
  previousCompleted: boolean
): Lesson {
  const type = faker.helpers.arrayElement(LESSON_TYPES);
  const completed =
    previousCompleted && faker.datatype.boolean({ probability: 0.4 });

  return {
    id: faker.string.uuid(),
    moduleId,
    title: faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
    description: faker.lorem.sentence(),
    type,
    content: type === 'text' ? faker.lorem.paragraphs(3) : undefined,
    videoUrl:
      type === 'video'
        ? 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
        : undefined,
    audioUrl: type === 'audio' ? faker.internet.url() : undefined,
    duration: ['video', 'audio'].includes(type)
      ? faker.number.int({ min: 180, max: 3600 })
      : undefined,
    completed,
    locked: !previousCompleted && order > 0,
    order,
    subtitles:
      type === 'video'
        ? [
            {
              lang: 'en',
              label: 'English',
              src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
            },
          ]
        : undefined,
    transcript: type === 'video' ? faker.lorem.paragraphs(5) : undefined,
    bookmarked: faker.datatype.boolean({ probability: 0.2 }),
    timeSpent: completed ? faker.number.int({ min: 60, max: 3600 }) : 0,
    lastAccessed: completed ? faker.date.recent().toISOString() : undefined,
  };
}

function generateModule(
  courseId: string,
  order: number,
  previousModuleCompleted: boolean
): Module {
  const moduleId = faker.string.uuid();
  const lessonCount = faker.number.int({ min: 3, max: 8 });
  let lastLessonCompleted = previousModuleCompleted;

  const lessons = Array.from({ length: lessonCount }, (_, i) => {
    const lesson = generateLesson(moduleId, i, lastLessonCompleted);
    lastLessonCompleted = lesson.completed;
    return lesson;
  });

  const completedCount = lessons.filter((l) => l.completed).length;
  const completionPercentage = Math.round((completedCount / lessonCount) * 100);

  return {
    id: moduleId,
    courseId,
    title: `Module ${order + 1}: ${faker.lorem.words(3)}`,
    description: faker.lorem.sentence(),
    lessons,
    order,
    completionPercentage,
    estimatedDuration: faker.number.int({ min: 1800, max: 14400 }),
    locked: !previousModuleCompleted && order > 0,
  };
}

export function generateCourseDetail(courseId: string): CourseDetail {
  const moduleCount = faker.number.int({ min: 3, max: 6 });
  let lastModuleCompleted = true;

  const modules = Array.from({ length: moduleCount }, (_, i) => {
    const module = generateModule(courseId, i, lastModuleCompleted);
    lastModuleCompleted = module.completionPercentage === 100;
    return module;
  });

  const allLessons = modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => l.completed).length;
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  const lastAccessedLesson = allLessons
    .filter((l) => l.lastAccessed)
    .sort(
      (a, b) =>
        new Date(b.lastAccessed!).getTime() -
        new Date(a.lastAccessed!).getTime()
    )[0];

  return {
    id: courseId,
    title: faker.lorem.words(faker.number.int({ min: 3, max: 6 })),
    description: faker.lorem.paragraphs(2),
    instructor: {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
    },
    progressPercentage,
    modules,
    rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    totalLessons,
    completedLessons,
    totalStudents: faker.number.int({ min: 100, max: 10000 }),
    coverImage: faker.image.urlLoremFlickr({ category: 'education' }),
    category: faker.helpers.arrayElement([
      'Web Development',
      'Data Science',
      'Design',
      'Business',
      'Marketing',
    ]),
    level: faker.helpers.arrayElement([
      'beginner',
      'intermediate',
      'advanced',
    ] as const),
    estimatedDuration: modules.reduce(
      (sum, m) => sum + (m.estimatedDuration || 0),
      0
    ),
    lastAccessedLessonId: lastAccessedLesson?.id,
    enrolledAt: faker.date.past().toISOString(),
    certificates:
      progressPercentage === 100
        ? [
            {
              id: faker.string.uuid(),
              issuedAt: faker.date.recent().toISOString(),
              url: faker.internet.url(),
            },
          ]
        : undefined,
  };
}

export async function fetchCourseDetail(
  courseId: string
): Promise<CourseDetail> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const data = generateCourseDetail(courseId);
  return courseDetailSchema.parse(data);
}

export async function fetchQuizForLesson(lessonId: string): Promise<Quiz> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const quiz = generateQuiz(lessonId);
  return quizSchema.parse(quiz);
}

export async function fetchAssignmentForLesson(
  lessonId: string
): Promise<Assignment> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const assignment = generateAssignment(lessonId);
  return assignmentSchema.parse(assignment);
}

export async function fetchResourcesForLesson(
  lessonId: string,
  count: number = 3
): Promise<Resource[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateResources(count);
}
