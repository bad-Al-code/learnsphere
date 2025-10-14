import { faker } from '@faker-js/faker';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { eq } from 'drizzle-orm';
import { db } from '..';
import logger from '../../config/logger';
import { studentGrades } from '../schema';

const TARGET_STUDENT_ID = 'b06531a1-2563-4702-8706-819ce72649ac';
const TARGET_COURSE_IDS = [
  '8bc1e072-e11a-40d4-b436-e713b0921433',
  '0b72ac05-aa68-43a3-b340-258feebf573c',
  'cb4bf3b6-c1cf-4d4b-99f6-26abed7c75dd',
];

async function seedStudentGrades() {
  logger.info(
    `Starting to seed historical grades for student: ${TARGET_STUDENT_ID}`
  );

  try {
    await db
      .delete(studentGrades)
      .where(eq(studentGrades.studentId, TARGET_STUDENT_ID));
    logger.info(`Cleared existing grades for target student.`);

    const gradesToInsert = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = subMonths(now, i);
      const start = startOfMonth(month);
      const end = endOfMonth(month);

      const assignmentsThisMonth = faker.number.int({ min: 2, max: 4 });

      for (let j = 0; j < assignmentsThisMonth; j++) {
        const courseId = faker.helpers.arrayElement(TARGET_COURSE_IDS);

        const baseGrade = 75 + (5 - i) * 3;
        const grade = faker.number.int({
          min: baseGrade,
          max: Math.min(baseGrade + 10, 100),
        });

        gradesToInsert.push({
          submissionId: faker.string.uuid(),
          assignmentId: faker.string.uuid(),
          courseId: courseId,
          moduleId: faker.string.uuid(),
          studentId: TARGET_STUDENT_ID,
          grade: grade,
          gradedAt: faker.date.between({ from: start, to: end }),
        });
      }
    }

    if (gradesToInsert.length > 0) {
      await db.insert(studentGrades).values(gradesToInsert);
      logger.info(
        `Successfully inserted ${gradesToInsert.length} historical grade records.`
      );
    }
  } catch (error) {
    logger.error('Failed to seed historical grades:', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

seedStudentGrades().then(() => {
  logger.info('Grade seeding script finished.');
  process.exit(0);
});
