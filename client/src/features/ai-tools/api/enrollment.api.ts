import { enrollmentService } from '@/lib/api/server';
import { EnrolledCourse } from '../schemas/enrollment.schema';

export const getEnrolledCourses = (): Promise<EnrolledCourse[]> => {
  return enrollmentService.getTyped<EnrolledCourse[]>(
    '/api/enrollments/my-courses'
  );
};
