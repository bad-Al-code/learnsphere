import { faker } from '@faker-js/faker';
import { db } from '..';
import { modules } from '../schema';

const courseIds = [
  '3348323e-cea2-4292-9cf2-43d6efd3b1b6',
  '3c098bd2-ccc0-4974-8e82-06685ade804f',
  '9fc362d5-acd9-4ffd-a1cc-3d5be7855023',
  '5f45854a-80c2-4b10-87a4-2d70ba9ad1b4',
  '6c8acd42-2f72-4cee-bed1-8364b8823a17',
  'e5dcb6ee-c954-4164-9e20-6948c3206ad8',
  '6877a40c-f00f-4043-be57-a77a837683cb',
  'ee1d9f9d-28da-415c-8567-21430af7f025',
  '23e0dc65-286e-47e3-a303-9309332866e9',
  '7ed746db-9cee-4efa-bd79-4255aa22a0bd',
];

export async function seedModules(courseIds: string[]) {
  for (const courseId of courseIds) {
    const moduleCount = faker.number.int({ min: 4, max: 6 });

    console.log(`Seeding ${moduleCount} modules for course ${courseId}`);

    for (let i = 0; i < moduleCount; i++) {
      const title = faker.company.catchPhrase();
      const order = i;

      const [module] = await db
        .insert(modules)
        .values({
          title,
          courseId,
          order,
        })
        .returning();

      console.log(
        `Module ${i + 1} created with ID: ${module.id} (Course: ${courseId})`
      );
    }
  }

  console.log('All modules seeded.');
}

seedModules(courseIds);
