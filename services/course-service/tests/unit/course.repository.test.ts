import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from "vitest";

import { db } from "../../src/db";
import { CourseRepository } from "../../src/db/repostiories";
import { courses } from "../../src/db/schema";

beforeEach(async () => {
  await db.delete(courses);
})

describe('CourseRepository', () => {
  describe('create() and findById()', () => {
    it('should create a new course and allow it to be found by its ID', async () => {
      const newCourseData = {
        title: 'Test',
        description: 'Test Description',
        instructorId: faker.string.uuid()
      };

      const createdCourse = await CourseRepository.create(newCourseData);
      expect(createdCourse).toBeDefined();
      expect(createdCourse.title).toBe(newCourseData.title);

      const foundCourse = await CourseRepository.findById(createdCourse.id);
      expect(foundCourse).toBeDefined();
      expect(foundCourse?.id).toBe(createdCourse.id)

    })
  })

  describe('updateStatus()', () => {
    it('should update the status of an existing course', async () => {
      const course = await CourseRepository.create({
        title: 'Draft Course',
        instructorId: faker.string.uuid(),
      });
      expect(course.status).toBe('draft');

      const updatedCourse = await CourseRepository.updateStatus(course.id, 'published');

      expect(updatedCourse.status).toBe('published');
    });
  });
})