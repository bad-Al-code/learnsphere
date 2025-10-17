import { faker } from '@faker-js/faker';
import {
  type CourseDetail,
  courseDetailSchema,
} from '../schema/course-detail.schema';

// Generate fake course detail data
export function generateCourseDetail(courseId: string): CourseDetail {
  const modules = Array.from({ length: 4 }, (_, i) => ({
    id: faker.string.uuid(),
    courseId,
    title: `Module ${i + 1}: ${faker.lorem.words(3)}`,
    description: faker.lorem.sentence(),
    order: i,
    lessons: Array.from({ length: 3 }, (_, j) => ({
      id: faker.string.uuid(),
      moduleId: faker.string.uuid(),
      title: `Lesson ${j + 1}: ${faker.lorem.words(2)}`,
      description: faker.lorem.sentence(),
      type: (['video', 'text', 'quiz'] as const)[j % 3],
      content: faker.lorem.paragraphs(2),
      videoUrl: 'https://example.com/video.mp4',
      duration: faker.number.int({ min: 5, max: 60 }),
      completed: Math.random() > 0.5,
    })),
  }));

  const assignments = Array.from({ length: 6 }, () => ({
    id: faker.string.uuid(),
    moduleId: modules[Math.floor(Math.random() * modules.length)].id,
    title: `Assignment: ${faker.lorem.words(3)}`,
    description: faker.lorem.sentence(),
    dueDate: faker.date.future().toISOString(),
    points: faker.number.int({ min: 10, max: 100 }),
    status: (['pending', 'submitted', 'graded'] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));

  const resources = Array.from({ length: 8 }, () => ({
    id: faker.string.uuid(),
    courseId,
    title: `${faker.lorem.words(2)}`,
    description: faker.lorem.sentence(),
    type: (['pdf', 'link', 'document'] as const)[Math.floor(Math.random() * 3)],
    url: faker.internet.url(),
  }));

  return {
    id: courseId,
    title: faker.lorem.words(4),
    description: faker.lorem.paragraphs(2),
    instructor: {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    },
    progressPercentage: faker.number.int({ min: 0, max: 100 }),
    modules,
    assignments,
    resources,
  };
}

export async function fetchCourseDetail(
  courseId: string
): Promise<CourseDetail> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const data = generateCourseDetail(courseId);
  return courseDetailSchema.parse(data);
}
