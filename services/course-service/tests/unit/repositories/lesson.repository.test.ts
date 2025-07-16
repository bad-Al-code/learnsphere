import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../../src/db';
import { LessonRepository } from '../../../src/db/repostiories';
import {
  courses,
  lessons,
  modules,
  textLessonContent,
} from '../../../src/db/schema';

beforeEach(async () => {
  await db.delete(textLessonContent);
  await db.delete(lessons);
  await db.delete(modules);
  await db.delete(courses);
});

describe('LessonRepository', () => {
  async function createCourseModule() {
    const [course] = await db
      .insert(courses)
      .values({
        title: 'Test Course',
        instructorId: faker.string.uuid(),
        status: 'published',
      })
      .returning();

    const [module] = await db
      .insert(modules)
      .values({
        title: 'Test Module',
        courseId: course.id,
        order: 1,
      })
      .returning();

    return { course, module };
  }

  describe('create() and findById()', () => {
    it('should create a lesson and retrieve it with module and course', async () => {
      const { module, course } = await createCourseModule();

      const lesson = await LessonRepository.create({
        title: 'Lesson 1',
        moduleId: module.id,
        order: 1,
        lessonType: 'text',
      });

      const found = await LessonRepository.findById(lesson.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe('Lesson 1');
      expect(found?.module?.id).toBe(module.id);
      expect(found?.module?.course?.id).toBe(course.id);
    });
  });

  describe('findByIdWithContent()', () => {
    it('should return a lesson with its text content', async () => {
      const { module } = await createCourseModule();

      const lesson = await LessonRepository.create({
        title: 'Lesson with text',
        moduleId: module.id,
        order: 1,
        lessonType: 'text',
      });

      await LessonRepository.createTextContent(lesson.id, 'Hello world');

      const fullLesson = await LessonRepository.findByIdWithContent(lesson.id);
      expect(fullLesson).toBeDefined();
      expect(fullLesson?.textContent?.content).toBe('Hello world');
    });
  });

  describe('findManyByIdsWithModule()', () => {
    it('should return multiple lessons with their module and course', async () => {
      const { module, course } = await createCourseModule();

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

      const found = await LessonRepository.findManyByIdsWithModule([
        lesson1.id,
        lesson2.id,
      ]);

      expect(found.length).toBe(2);
      expect(found[0].module?.id).toBe(module.id);
      expect(found[0].module?.course?.id).toBe(course.id);
    });
  });

  describe('update()', () => {
    it('should update a lesson title and order', async () => {
      const { module } = await createCourseModule();

      const lesson = await LessonRepository.create({
        title: 'Initial Title',
        moduleId: module.id,
        order: 1,
        lessonType: 'text',
      });

      const updated = await LessonRepository.update(lesson.id, {
        title: 'Updated Title',
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.order).toBe(1);
    });
  });

  describe('delete()', () => {
    it('should delete a lesson by ID', async () => {
      const { module } = await createCourseModule();

      const lesson = await LessonRepository.create({
        title: 'To Delete',
        moduleId: module.id,
        order: 1,
        lessonType: 'text',
      });

      await LessonRepository.delete(lesson.id);

      const found = await LessonRepository.findById(lesson.id);
      expect(found).toBeUndefined();
    });
  });

  describe('createTextContent()', () => {
    it('should create text content for a lesson', async () => {
      const { module } = await createCourseModule();

      const lesson = await LessonRepository.create({
        title: 'With Text',
        moduleId: module.id,
        order: 1,
        lessonType: 'text',
      });

      await LessonRepository.createTextContent(lesson.id, 'Text body');

    });
  });

});
