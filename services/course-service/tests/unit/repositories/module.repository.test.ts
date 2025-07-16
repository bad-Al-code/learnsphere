import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../../src/db';
import { ModuleRepository } from '../../../src/db/repostiories';
import {
  courses,
  lessons,
  modules,
} from '../../../src/db/schema';

beforeEach(async () => {
  await db.delete(lessons);
  await db.delete(modules);
  await db.delete(courses);
});

describe('ModuleRepository', () => {
  async function createCourse() {
    const [course] = await db
      .insert(courses)
      .values({
        title: 'Test Course',
        instructorId: faker.string.uuid(),
        status: 'published',
      })
      .returning();
    return course;
  }

  describe('create() and findById()', () => {
    it('should create and fetch a module with its parent course', async () => {
      const course = await createCourse();

      const module = await ModuleRepository.create({
        title: 'Intro Module',
        courseId: course.id,
        order: 1,
      });

      const found = await ModuleRepository.findById(module.id);

      expect(found).toBeDefined();
      expect(found?.title).toBe('Intro Module');
      expect(found?.course?.id).toBe(course.id);
    });
  });

  describe('findManyByIdsWithCourse()', () => {
    it('should return multiple modules with their parent courses', async () => {
      const course = await createCourse();

      const [m1, m2] = await db
        .insert(modules)
        .values([
          { title: 'Module 1', courseId: course.id, order: 1 },
          { title: 'Module 2', courseId: course.id, order: 2 },
        ])
        .returning();

      const results = await ModuleRepository.findManyByIdsWithCourse([
        m1.id,
        m2.id,
      ]);

      expect(results.length).toBe(2);
      expect(results[0].course?.id).toBe(course.id);
    });
  });

  describe('findByIdWithLessons()', () => {
    it('should return a module with its lessons ordered by lesson order', async () => {
      const course = await createCourse();

      const [mod] = await db
        .insert(modules)
        .values({ title: 'Mod', courseId: course.id, order: 1 })
        .returning();

      await db.insert(lessons).values([
        { title: 'Lesson B', moduleId: mod.id, order: 2, lessonType: 'text' },
        { title: 'Lesson A', moduleId: mod.id, order: 1, lessonType: 'text' },
      ]);

      const result = await ModuleRepository.findByIdWithLessons(mod.id);

      expect(result?.lessons?.length).toBe(2);
      expect(result?.lessons[0].order).toBe(1);
      expect(result?.lessons[1].order).toBe(2);
    });
  });

  describe('findManyByCourseId()', () => {
    it('should return modules for a given course ordered by order', async () => {
      const course = await createCourse();

      await db.insert(modules).values([
        { title: 'Mod B', courseId: course.id, order: 2 },
        { title: 'Mod A', courseId: course.id, order: 1 },
      ]);
      const results = await ModuleRepository.findManyByCourseId(course.id)


      expect(results.length).toBe(2);
      expect(results[0].title).toBe('Mod A');
      expect(results[1].title).toBe('Mod B');
    });
  });

  describe('countByCourseId()', () => {
    it('should return the number of modules for a course', async () => {
      const course = await createCourse();

      await db.insert(modules).values([
        { title: 'M1', courseId: course.id, order: 1 },
        { title: 'M2', courseId: course.id, order: 2 },
      ]);

      const count = await ModuleRepository.countByCourseId(course.id);
      expect(count).toBe(2);
    });
  });

  describe('update()', () => {
    it('should update a module\'s title and order', async () => {
      const course = await createCourse();

      const module = await ModuleRepository.create({
        title: 'Old Title',
        courseId: course.id,
        order: 1,
      });

      const updated = await ModuleRepository.update(module.id, {
        title: 'New Title',
        order: 3,
      });

      expect(updated.title).toBe('New Title');
      expect(updated.order).toBe(3);
    });
  });

  describe('delete()', () => {
    it('should delete a module by ID', async () => {
      const course = await createCourse();

      const module = await ModuleRepository.create({
        title: 'To Delete',
        courseId: course.id,
        order: 1,
      });

      await ModuleRepository.delete(module.id);

      const found = await ModuleRepository.findById(module.id);
      expect(found).toBeUndefined();
    });
  });
});
