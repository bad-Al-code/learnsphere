import { faker } from '@faker-js/faker';
import { and, eq } from 'drizzle-orm';
import { db } from '..';
import logger from '../../config/logger';
import { enrollments } from '../schema';

const TARGET_STUDENT_ID = 'b06531a1-2563-4702-8706-819ce72649ac';

const courseTags: Record<string, string[]> = {
  '8bc1e072-e11a-40d4-b436-e713b0921433': ['React', 'Frontend', 'JavaScript'],
  '0b72ac05-aa68-43a3-b340-258feebf573c': ['Node.js', 'Backend', 'API'],
  'cb4bf3b6-c1cf-4d4b-99f6-26abed7c75dd': ['SQL', 'Database', 'PostgreSQL'],
};

async function seedCertificates() {
  logger.info(
    `Starting to seed certificate data for student: ${TARGET_STUDENT_ID}`
  );

  try {
    const completedEnrollments = await db.query.enrollments.findMany({
      where: and(
        eq(enrollments.userId, TARGET_STUDENT_ID),
        eq(enrollments.status, 'completed')
      ),
    });

    if (completedEnrollments.length === 0) {
      logger.warn(
        'No completed enrollments found for the target student. Cannot seed certificates.'
      );
      return;
    }

    logger.info(
      `Found ${completedEnrollments.length} completed enrollments to update.`
    );

    const updatePromises = completedEnrollments.map((enrollment) => {
      const credentialId = `LS-${faker.string.alphanumeric(4).toUpperCase()}-${faker.string.numeric(4)}`;

      const keywords =
        courseTags[enrollment.courseId]?.join(',') ||
        'certificate,education,achievement';
      const unsplashUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(keywords)}`;

      return db
        .update(enrollments)
        .set({
          certificateId: credentialId,
          certificateUrl: unsplashUrl,
          tags: courseTags[enrollment.courseId] || ['General'],
          isFavorite: faker.datatype.boolean(0.3),
          notes: faker.datatype.boolean(0.5) ? faker.lorem.sentence() : null,
        })
        .where(eq(enrollments.id, enrollment.id));
    });

    await Promise.all(updatePromises);

    logger.info(
      `Successfully added certificate data to ${updatePromises.length} enrollments.`
    );
  } catch (error) {
    logger.error('Failed to seed certificate data: %o', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

seedCertificates().then(() => {
  logger.info('Certificate seeding script finished.');
  process.exit(0);
});
