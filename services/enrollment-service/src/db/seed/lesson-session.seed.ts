import { faker } from '@faker-js/faker';
import { subDays } from 'date-fns';
import { eq } from 'drizzle-orm';
import { db } from '..';
import logger from '../../config/logger';
import { lessonSessions } from '../schema';

const TARGET_STUDENT_ID = 'b06531a1-2563-4702-8706-819ce72649ac';
const TARGET_COURSE_IDS = [
  '8bc1e072-e11a-40d4-b436-e713b0921433',
  '0b72ac05-aa68-43a3-b340-258feebf573c',
  'cb4bf3b6-c1cf-4d4b-99f6-26abed7c75dd',
];

async function seedStudentSessions() {
  logger.info(
    `Starting to seed historical lesson sessions for student: ${TARGET_STUDENT_ID}`
  );

  try {
    await db
      .delete(lessonSessions)
      .where(eq(lessonSessions.userId, TARGET_STUDENT_ID));

    logger.info(`Cleared existing lesson sessions for target student.`);

    const sessionsToInsert = [];
    const now = new Date();

    for (let i = 0; i < 56; i++) {
      if (Math.random() < 0.7) {
        const day = subDays(now, i);
        const sessionsThisDay = faker.number.int({ min: 1, max: 3 });

        for (let j = 0; j < sessionsThisDay; j++) {
          const startedAt = faker.date.between({
            from: new Date(day.setHours(8, 0, 0, 0)),
            to: new Date(day.setHours(22, 0, 0, 0)),
          });
          const durationMinutes = faker.number.int({ min: 20, max: 120 });
          const endedAt = new Date(
            startedAt.getTime() + durationMinutes * 60 * 1000
          );

          sessionsToInsert.push({
            sessionId: faker.string.uuid(),
            userId: TARGET_STUDENT_ID,
            courseId: faker.helpers.arrayElement(TARGET_COURSE_IDS),
            moduleId: faker.string.uuid(),
            lessonId: faker.string.uuid(),
            startedAt,
            endedAt,
            durationMinutes,
          });
        }
      }
    }

    if (sessionsToInsert.length > 0) {
      await db.insert(lessonSessions).values(sessionsToInsert);
      logger.info(
        `Successfully inserted ${sessionsToInsert.length} historical lesson session records.`
      );
    }
  } catch (error) {
    logger.error('Failed to seed historical lesson sessions:', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

seedStudentSessions().then(() => {
  logger.info('Lesson session seeding script finished.');
  process.exit(0);
});
