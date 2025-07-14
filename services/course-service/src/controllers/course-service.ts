import axios from 'axios';
import { eq } from 'drizzle-orm';
import logger from '../config/logger';
import { db } from '../db';
import { lessons } from '../db/schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { env } from '../config/env';

export class CourseService {
  public static async requestVideoUploadUrl(
    lessonId: string,
    filename: string,
    requesterId: string
  ) {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { module: { with: { course: true } } },
    });
    if (!lesson) {
      throw new NotFoundError('Lesson');
    }
    if (lesson.module.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }
    if (lesson.lessonType !== 'video') {
      throw new BadRequestError('This lesson is not a video lesson');
    }

    const mediaServiceUrl = env.MEDIA_SERVICE_URL!;
    logger.info(
      `Requesting video upload URL from media-serice for lesson: ${lessonId}`
    );

    try {
      const response = await axios.post(
        `${mediaServiceUrl}/api/media/request-upload-url`,
        {
          filename,
          uploadType: 'video',
          metadata: { lessonId: lessonId },
        }
      );

      return response.data;
    } catch (error) {
      logger.error(`Error contacting media-service for video upload URL`, {
        error,
      });

      throw new Error('Could not create video upload url');
    }
  }
}
