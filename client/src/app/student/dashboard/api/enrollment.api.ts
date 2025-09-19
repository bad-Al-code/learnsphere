import { enrollmentService } from '@/lib/api/server';
import { MyCourse } from '../schema/enrollment.schema';

export const getMyEnrolledCourses = (): Promise<MyCourse[]> => {
  return enrollmentService.getTyped<MyCourse[]>('/api/enrollments/my-courses');
};
