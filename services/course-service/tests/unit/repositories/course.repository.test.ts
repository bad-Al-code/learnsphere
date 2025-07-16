import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../../src/db';
import { CourseRepository } from '../../../src/db/repostiories';
import { courses, lessons, modules, textLessonContent } from '../../../src/db/schema';

beforeEach(async () => {
  await db.delete(textLessonContent);
  await db.delete(lessons);
  await db.delete(modules);
  await db.delete(courses);
});

describe('CourseRepository', () => {
  describe('create() and findById()', () => {
    it('should create and retrieve a course by ID', async () => {
      const newCourse = {
        title: 'Test Course',
        description: 'Test Desc',
        instructorId: faker.string.uuid(),
      };

      const created = await CourseRepository.create(newCourse);
      expect(created).toBeDefined();
      expect(created.title).toBe(newCourse.title);

      const found = await CourseRepository.findById(created.id);
      expect(found?.id).toBe(created.id);
    });
  });

  describe('updateStatus()', () => {
    it('should change status to published', async () => {
      const course = await CourseRepository.create({
        title: 'Test',
        instructorId: faker.string.uuid(),
      });

      expect(course.status).toBe('draft');
      const updated = await CourseRepository.updateStatus(course.id, 'published');
      expect(updated.status).toBe('published');
    });
  });

  describe('update()', () => {
    it('should update course title and description', async () => {
      const course = await CourseRepository.create({
        title: 'Old Title',
        description: 'Old Desc',
        instructorId: faker.string.uuid(),
      });

      const updated = await CourseRepository.update(course.id, {
        title: 'New Title',
        description: 'New Desc',
      });

      expect(updated.title).toBe('New Title');
      expect(updated.description).toBe('New Desc');
    });
  });

  describe('delete()', () => {
    it('should delete a course by ID', async () => {
      const course = await CourseRepository.create({
        title: 'To Be Deleted',
        instructorId: faker.string.uuid(),
      });

      await CourseRepository.delete(course.id);
      const found = await CourseRepository.findById(course.id);
      expect(found).toBeUndefined();
    });
  });

  describe('findManyIds()', () => {
    it('should return multiple courses by their IDs', async () => {
      const c1 = await CourseRepository.create({
        title: 'Course 1',
        instructorId: faker.string.uuid(),
      });

      const c2 = await CourseRepository.create({
        title: 'Course 2',
        instructorId: faker.string.uuid(),
      });

      const found = await CourseRepository.findManyIds([c1.id, c2.id]);
      const ids = found.map(c => c.id);

      expect(ids).toContain(c1.id);
      expect(ids).toContain(c2.id);
    });

    it('should return empty array if input is empty', async () => {
      const found = await CourseRepository.findManyIds([]);
      expect(found).toEqual([]);
    });
  });

  describe('listPublished()', () => {
    it('should return paginated published courses', async () => {
      const unpublished = await CourseRepository.create({
        title: 'Unpublished',
        instructorId: faker.string.uuid(),
      });

      await CourseRepository.create({
        title: 'Published 1',
        instructorId: faker.string.uuid(),
        status: 'published',
      });

      await CourseRepository.create({
        title: 'Published 2',
        instructorId: faker.string.uuid(),
        status: 'published',
      });

      const { results, totalResults } = await CourseRepository.listPublished(10, 0);
      expect(results.length).toBe(2);
      expect(totalResults).toBe(2);
      expect(results.every(c => c.status === 'published')).toBe(true);
    });

    it('should return paginated results with offset', async () => {
      await CourseRepository.create({
        title: 'Published A',
        instructorId: faker.string.uuid(),
        status: 'published',
      });

      await CourseRepository.create({
        title: 'Published B',
        instructorId: faker.string.uuid(),
        status: 'published',
      });

      const { results, totalResults } = await CourseRepository.listPublished(1, 1);
      expect(results.length).toBe(1);
      expect(totalResults).toBe(2);
    });
  });

  describe('findByIdWithRelations()', () => {
    it('should return a course with nested modules, lessons, and text content', async () => {
      const course = await CourseRepository.create({
        title: 'Course with relations',
        instructorId: faker.string.uuid(),
        status: 'published',
      });

      const [module] = await db
        .insert(modules)
        .values({
          title: 'Module 1',
          courseId: course.id,
          order: 1,
        })
        .returning();

      const [lesson1, lesson2] = await db
        .insert(lessons)
        .values([
          {
            title: 'Lesson 1',
            moduleId: module.id,
            order: 1,
            lessonType: 'text',
          },
          {
            title: 'Lesson 2',
            moduleId: module.id,
            order: 2,
            lessonType: 'text',
          },
        ])
        .returning();

      await db.insert(textLessonContent).values({
        lessonId: lesson1.id,
        content: 'This is lesson 1 content.',
      });

      const fullCourse = await CourseRepository.findByIdWithRelations(course.id);

      expect(fullCourse).toBeDefined();
      expect(fullCourse?.modules?.length).toBe(1);

      const retrievedModule = fullCourse?.modules[0];
      expect(retrievedModule?.title).toBe('Module 1');
      expect(retrievedModule?.lessons.length).toBe(2);

      const [retrievedLesson1, retrievedLesson2] = retrievedModule!.lessons;
      expect(retrievedLesson1.title).toBe('Lesson 1');
      expect(retrievedLesson2.title).toBe('Lesson 2');

      expect(retrievedLesson1.textContent).toBeDefined();
      expect(retrievedLesson1.textContent?.content).toBe('This is lesson 1 content.');

      expect(retrievedLesson2.textContent).toBeNull();
    });
  });

});
